const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./chain.proto";
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const blockchains = require("./model");
const axios = require("axios");

mongoose.connect("mongodb://localhost:27017",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("connected"))
  .catch((error)=> console.log(error));

 
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const chainService = grpc.loadPackageDefinition(packageDefinition).chainService;

const server = new grpc.Server();

server.addService(chainService.service, {
    getStatus:async (_, callback) => {
       
        const _blocks = await blockchains.find();
        const response=[];
        const Promises = _blocks.map(async (block) => {
            const latest_block_height = await getLatestBlockHeight(block.rpcUrl);
            if(latest_block_height){
              const _Status = {name:block.name,
                Status:'active', 
                height:latest_block_height
                 };
                 //const result ={statusList: stat};
                response.push(_Status);
                
            }else{
              const _Status = {name:block.name,
                Status:'inactive', 
                height:0
                 };
                 //const result ={statusList: stat};
                response.push(_Status);
                
            }
        });
        await Promise.all(Promises);
        const result = {statusList:response};
        callback(null, result);
        

        async function getLatestBlockHeight(rpcUrl) {
            try {
                //console.log(rpcUrl);
              const response = await axios.get(`${rpcUrl}/status`);
              //console.log( response.data.result.sync_info.latest_block_height);
              if (response.data) {
                return  response.data.result.sync_info.latest_block_height;
              } else {
                return 0;
              }
            } catch (error) {
              return 0;
            }
          }
    },
    getchain:async (_,callback) =>{
      try{
        const _chain = await blockchains.find();
        if(_chain){
          const response = {chainsList : _chain};
          callback(null,response);
        }else{
          const response ={errorMessage: 'no chains Found'};
          callback(null,response);
        }
      }catch(error){
        callback(error,null);
      }
      
    },
    createchain: async(call,callback) =>{
        const _chain = new blockchains(call.request);
        await _chain.save();
        callback(null,_chain);

    },
    update: async(_,callback) =>{
      const _name = _.request.name;
      const _chain = await blockchains.find({name:_name});
      if (!_chain) {
        // Handle case where no matching document is found
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Chain not found",
        });
        return;
      }
      //console.log(_chain);
      _chain.name=_.request.name;
      _chain.chainId= _.request.chainId;
      _chain.apiUrl=_.request.apiUrl;
      _chain.rpcUrl = _.request.rpcUrl;
      callback(null,_chain);
    },
    delete: async (_,callback) =>{
      try{
        const _name = _.request.name;
       const result= await blockchains.findOneAndDelete({name: _name});
       if(!result.value){
        const response = { errorMessage: 'Blockchain not found for deletion' };
        callback(null,response);
       }else{
        
        callback(null,{});
       }
        //console.log(blockchains);
       
      }catch(error){
        callback(error,null);
      }
       
    },
});

server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Server running at http://127.0.0.1:" + port);
    server.start();
});
