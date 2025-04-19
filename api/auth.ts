import { loginSchema, UserCreateSchema } from "@/schemas";
import { z } from "zod";
import { Axiosinstance, AxiosinstanceAuth } from "./instance";

// This function is used to register a new user
export const useRegister = async (data: z.infer<typeof UserCreateSchema>) => {
  const { confirmPassword, ...rest } = data;
  try {
    const response = await Axiosinstance.post("/auth/signup", rest);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

// This function is used to login a user
export const useLogin = async (data: z.infer<typeof loginSchema>) => {
  try {
    const response = await Axiosinstance.post("/auth/login", data);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

// This function is used to logout a user
export const useLogout = async () => {
  try {
    const response = await AxiosinstanceAuth.get("/auth/logout");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

// This function is used to verify the email token
export const useVerifyEmailToken = async (token: string) => {
  try {
    const response = await Axiosinstance.get(`/auth/verify/${token}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const useResendVerificationEmail = async (email: string) => {
  try {
    const response = await Axiosinstance.post("/auth/resend-verification", {
      email,
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const useForgotPassword = async (email: string) => {
  try {
    const response = await Axiosinstance.post("/auth/password-reset-request", {
      email,
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const useResetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await Axiosinstance.post(
      `/auth/password-reset-confirm/${token}`,
      {
        new_password: password,
        confirm_new_password: confirmPassword,
      }
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const useEnable2FA = async () => {
  try {
    const response = await AxiosinstanceAuth.get("/auth/enable-2FA");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const useDisable2FA = async () => {
  try {
    const response = await AxiosinstanceAuth.get("/auth/disable-2FA");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};

export const useVerify2FA = async (code: string) => {
  try {
    const response = await Axiosinstance.post("/auth/verify-2FA", { code });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
};
