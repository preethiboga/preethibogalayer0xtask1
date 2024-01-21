
import java.util.*;

public class MaxSum {
    public static long maxSubarraySum(int[] arr, int n) {
        long maxi = Long.MIN_VALUE; // maximum sum
        long sum = 0;

        for (int i = 0; i < n; i++) {

            sum += arr[i];

            if (sum > maxi) {
                maxi = sum;
            }

            // If sum < 0: discard the sum
            if (sum < 0) {
                sum = 0;
            }
        }

       

        //if (maxi < 0) maxi = 0;

        return maxi;
    }

    public static void main(String args[]) {
        //change input here
        int[] arr = {1,9,0,2,-8,4};
        int n = arr.length;
        long maxSum = maxSubarraySum(arr, n);
        System.out.println("The maximum subarray sum is: " + maxSum);

    }

}
