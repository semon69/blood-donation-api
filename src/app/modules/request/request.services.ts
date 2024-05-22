import { Request } from "express";
import { prisma } from "../../helpers/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const donationRequest = async (req: any) => {
  //   console.log({ user }, { payload });
  const user = req?.user;
  const payload = req.body;

  console.log(user);

  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.donorId,
    },
  });

  const requestData = {
    requesterId: user.id,
    ...payload,
  };

  const result = await prisma.request.create({
    data: requestData,
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return result;
};

const myDonationsRequest = async (req: any) => {
  const user = req?.user;

  const request = await prisma.request.findMany({
    where: {
      requesterId: user.id
    }
  })

  if(!request.length){
    throw new AppError(httpStatus.NOT_FOUND, "you don't have any request")
  }


  const result = await prisma.request.findMany({
    where: {
      requesterId: user.id,
    },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      },
    },
  });
  return result;
};
const donationRequestForMe = async (req: any) => {
  const user = req?.user;

  const donor = await prisma.request.findMany({
    where: {
      donorId: user.id
    }
  })

  if(!donor.length){
    throw new AppError(httpStatus.NOT_FOUND, "you don't have any request")
  }


  const result = await prisma.request.findMany({
    where: {
      donorId: user.id,
    },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      },
    },
  });
  return result;
};

const updatedDonationStatus = async (req: any) => {
  const { requestId } = req.params;
  const {status} = req.body;
  
  const userData = await prisma.request.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Request data not found"
    );
  }
  // console.log(donorData);
  const updateStatus = await prisma.request.update({
    where: {
      id: requestId
    },
    data: {
      requestStatus: status
    }
  })
  return updateStatus
};

export const requestService = {
  donationRequest,
  myDonationsRequest,
  donationRequestForMe,
  updatedDonationStatus,
};
