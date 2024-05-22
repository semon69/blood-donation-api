import httpStatus from "http-status";
import sendResponse from "../../helpers/sendResponse";
import catchAsync from "../../helpers/catchAsync";
import { authService } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {

  const result = await authService.changePassword(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfull",
    data: result,
    // data: {
    //     accessToken: result?.accessToken,
    //     needPasswordChange: result?.needPasswordChange
    // },
  });
});

export const authController = {
  loginUser,
  changePassword
};
