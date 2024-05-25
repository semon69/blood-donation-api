import httpStatus from "http-status";
import sendResponse from "../../helpers/sendResponse";
import { userService } from "./user.services";
import catchAsync from "../../helpers/catchAsync";

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const getDonorLists = catchAsync(async (req, res) => {
  const result = await userService.getDonorLists(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donors successfully found",
    meta: result.meta,
    data: result.data,
  });
});

const getAllUserForAdmin = catchAsync(async (req, res) => {
  const result = await userService.getAllUserForAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get ALl User successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await userService.getMyProfile(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const getSingleDonor = catchAsync(async (req, res) => {
  const result = await userService.getSingleDonor(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Donor data successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await userService.updateMyProfile(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const updateActiveStatus = catchAsync(async (req, res) => {
  const result = await userService.updateActiveStatus(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result = await userService.updateUserRole(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getDonorLists,
  getAllUserForAdmin,
  getMyProfile,
  getSingleDonor,
  updateMyProfile,
  updateActiveStatus,
  updateUserRole
};
