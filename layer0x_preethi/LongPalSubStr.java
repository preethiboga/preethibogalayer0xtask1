import java.util.*;
public class LongPalSubStr {
   static String longestpal(String S)
    {
        int left=0,right=0,maxlen=0;
        int n=S.length(),l=0,r=0;
        for(int i=0;i<n;i++)
        {
             l=i;
             r=i;
            while(l>=0 && r<=(n-1)  && S.charAt(l)==S.charAt(r))
            {
                l--;
                r++;
            }
            if((r-l+1)>maxlen)
            {
                maxlen=r-l+1;
                left=l+1;
                right=r-1;
            }
            l=i;
            r=i+1;
            while(l>=0 && r<=(n-1) && S.charAt(l)==S.charAt(r))
            {
                l--;
                r++;
            }
            if((r-l+1)>maxlen)
            {
                maxlen=r-l+1;
                left=l+1;
                right=r-1;
            }
           
            
        }
         String s="";
        for(int i=left;i<=right;i++)
            {
                s+=(S.charAt(i));
            }
            return s;

    }
    public static void main(String[] args)
    {
        String s;
        Scanner sc=new Scanner(System.in);
        s=sc.nextLine();
        String ans=longestpal(s);
        System.out.println("longest palindrome:" + ans);
    }
    
}
