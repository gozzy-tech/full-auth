import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosinstanceAuth } from "./instance";
import { UserUpdateType } from "@/schemas";

// get the user profile
export const useGetUserProfile = () => {
  return useQuery("userProfile", async () => {
    const response = await AxiosinstanceAuth.get("/user/profile");
    return response.data;
  });
};

// update the user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: Partial<UserUpdateType>) => {
      const response = await AxiosinstanceAuth.put("/user/update-user", data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userProfile");
      },
      onError: (error) => {
        console.error("Error updating user profile:", error);
      },
    }
  );
};
