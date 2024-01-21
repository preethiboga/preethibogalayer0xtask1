const express = require("express");

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./chain.proto";
const readline = require("readline");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);    
const chainService = grpc.loadPackageDefinition(packageDefinition).chainService;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const client = new chainService("localhost:50051", grpc.credentials.createInsecure());

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
  
//   rl.question("Enter block name: ", (name) => {
//     rl.question("Enter chainId: ", (chainId) => {
//       rl.question("Enter apiUrl: ",(apiUrl) =>{
//         rl.question("Enter rpcUrl:",(rpcUrl) => {
//             const blockData = {
//                 name,
//                 chainId: chainId ,
//                 apiUrl: apiUrl, // Set height to 0 as it will be calculated on the server side
//                 rpcUrl: rpcUrl,
//               };
              
//               client.createchain(blockData, (error, blockchain) => {
//                 if (error) {
//                   console.log(error);
//                 } else {
//                   console.log("Successfully created one block");
//                   console.log(blockchain);
//                 }
              
//             rl.close();
//         });
//       });  
//       });
//     });
//   });




app.get('/Api/status', async (req,res) =>{
    try {
        client.getStatus({}, (error, response) => {
            if (error) {
                //console.error(error);
                res.status(500).json({success:false, error: error.message});
            } else {
                //console.log(response);
                res.json({success:true , result:response});
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,error:error.message});
    }
})


app.get('/Api/chains',async (req,res) => {
    try {
        client.getchain({},(error,response) =>{
            if(error){
                
                res.status(500).json({success:false, response});
            }else{
                //console.log(response);
                res.json({ success: true, result: response });
                
            }
        }
    );
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,error:error.message});
    }
});


app.get('/Api/create',async (req,res) =>{
    try {
        client.createchain(
            {
                name:"omniflix false",
                chainId:"devnet1",
                apiUrl:"https://api.devnet-alpha.omniflix.network",
                rpcUrl:"https://rpc.devnet-alpha.omniflix.network",
            },(error,response) =>{
                if(error){
                    res.status(500).json({success:false,error:error.message});
                }else{
                    console.log("Successfully created one block");
                    //console.log(chain);
                    res.json({ success: true, result: response });
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,error:error.message});
    }
});


app.use('/Api/update',async (req,res)=> {
    try {
        client.update(
            {
                name:"omniflix false",
                chainId:"devnet1 edited",
                apiUrl:"https://api.devnet-alpha.omniflix.network",
                rpcUrl:"https://rpc.devnet-alpha.omniflix.network",
            },(error,response) => {
                if(error){
                    //console.log(error);
                    res.status(500).json({ success: false, error: error.message });
                }else{
                    console.log("Successfully edited the  block");
                    res.json({ success: true, result: response});
                }
            }
        );
        
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,error:error.message});
    }
})


app.get('/Api/delete',async (req,res)=> {
    try{
        client.delete(
            {
                name:'omniflix false',
            },(error,response) =>{
                if(error){
                    //console.error(err);
                     res.status(500).json({ success: false, error: error.message });
                }else{
                    console.log("Successfully deleted");
                    res.json({ success: true, result: response});
                }
            }
        );
    }catch (error) {
        console.error(error);
        res.status(500).json({success:false,error:error.message});
    }
});



app.listen(PORT, () => {
    console.log(`API listening at http://localhost:${PORT}/Api`);
  });
  