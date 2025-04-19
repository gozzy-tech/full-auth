import { loginSchema, UserCreateSchema } from "@/schemas";
import { z } from "zod";
import { Axiosinstance, AxiosinstanceAuth } from "./instance";

// -------------------------------------------------
// This function is used to register a new user
// -------------------------------------------------
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

// -------------------------------------------------
// This function is used to login a user
// -------------------------------------------------
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

// -------------------------------------------------
// This function is used to logout a user
// -------------------------------------------------
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

// ---------------------------------------------------------
// This function is used to verify the email token
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// This function is used to resend the verification email
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// This function is used to send the forgot password email
// ---------------------------------------------------------
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

// -------------------------------------------------
// This function is used to reset the password
// -------------------------------------------------
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

// ---------------------------------------------------------------
// This function is used to reset the password with old password
// ---------------------------------------------------------------
export const useResetPasswordWithOldPassword = async (
  old_password: string,
  new_password: string,
  confirm_new_password: string
) => {
  try {
    const response = await AxiosinstanceAuth.post("/auth/password-reset", {
      old_password,
      new_password,
      confirm_new_password,
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

// -------------------------------------------------
// This function is used to enable 2FA
// -------------------------------------------------
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

// -------------------------------------------------
// This function is used to disable the 2FA
// -------------------------------------------------

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

// -----------------------------------------------
// This function is used to verify the 2FA code
// ------------------------------------------------

export const useVerify2FA = async (code: string) => {
  try {
    const response = await Axiosinstance.get(`/auth/verify-2FA-code/${code}`);
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

// ----------------------------------------------
// This function is used to resend the 2FA code
// ----------------------------------------------
export const useResend2FA = async (email: string) => {
  try {
    const response = await AxiosinstanceAuth.post("/auth/resend-2FA-code", {
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

// --------------------------------------------------
// This function is used to login a user with Google
// --------------------------------------------------

export const useGetOauthtoken = async (code: string) => {
  try {
    const response = await Axiosinstance.get(`/auth/oauth_token/${code}`);
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
