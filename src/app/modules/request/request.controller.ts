import httpStatus from "http-status";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import { requestService } from "./request.services";

const donationRequest = catchAsync(async (req, res) => {
  const result = await requestService.donationRequest(req);
  // res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Request successfully made",
    data: result,
  });
});

const myDonations = catchAsync(async (req, res) => {
  const result = await requestService.myDonations(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation requests retrieved successfully",
    data: result,
  });
});

const updatedDonationStatus = catchAsync(async (req, res) => {
  const result = await requestService.updatedDonationStatus(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status successfully updated",
    data: result,
  });
});

export const requestController = {
  donationRequest,
  myDonations,
  updatedDonationStatus
};
