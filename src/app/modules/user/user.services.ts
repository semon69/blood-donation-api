import bcrypt from "bcrypt";
import { prisma } from "../../helpers/prisma";
import { Prisma } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createUser = async (payload: any) => {
  if (payload.password != payload.confirmPassword) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Password doesn't match"
    );
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const role = "user";

  const userData = {
    name: payload.name,
    userName: payload.userName,
    email: payload.email,
    password: hashedPassword,
    role,
    image: payload.image,
    contactNo: payload.contactNo,
    availability: payload?.availability,
    bloodType: payload.bloodType,
    location: payload.location,
    lastDonationDate: payload.lastDonationDate,
  };

  // const userProfileData = {
  //   age: payload.age,
  //   bio: payload.bio,
  //   lastDonationDate: payload.lastDonationDate,
  // };
  const createUserData = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      userName: true,
      email: true,
      role: true,
      image: true,
      contactNo: true,
      bloodType: true,
      location: true,
      availability: true,
      lastDonationDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // const result = await prisma.$transaction(async (transactionClient) => {

  //   // const createUserProfile = await transactionClient.userProfile.create({
  //   //   data: {
  //   //     userId: createUserData.id,
  //   //     ...userProfileData,
  //   //   },
  //   // });

  //   // Update the selected user data to include the created userProfile
  //   // createUserData.userProfile = createUserProfile;

  //   return createUserData;
  // });

  return createUserData;
};

const getDonorLists = async (queryParams: any) => {
  //   const { searchTerm, ...filterData } = params;

  const {
    page = 1,
    limit = 20,
    sortBy,
    sortOrder,
    searchTerm,
    ...filterData
  } = queryParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // const andConditions: Prisma.UserWhereInput[] = [];
  const andConditions: Prisma.UserWhereInput[] = [{ isActive: true }];

  if (searchTerm) {
    andConditions.push({
      OR: ["email", "name", "location", "bloodType"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const filterDataArray = Object.keys(filterData);
  if (filterDataArray.length > 0) {
    andConditions.push({
      AND: filterDataArray.map((key) => {
        const value = filterData[key];
        if (typeof value === "string") {
          if (
            value.toLowerCase() === "true" ||
            value.toLowerCase() === "false"
          ) {
            return {
              [key]: {
                equals: value.toLowerCase() === "true",
              },
            };
          } else {
            return {
              [key]: {
                equals: value,
              },
            };
          }
        } else {
          return {
            [key]: {
              equals: value,
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  //   console.dir(whereConditions, { depth: Infinity });

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      name: true,
      email: true,
      userName: true,
      image: true,
      contactNo: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
    },
    data: result,
  };
};

const getAllUserForAdmin = async () => {
  const result = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      userName: true,
      image: true,
      contactNo: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 10,
    },
    data: result,
  };
};

const getMyProfile = async (req: any) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: req.user.id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      userName: true,
      role: true,
      image: true,
      contactNo: true,
      bloodType: true,
      location: true,
      availability: true,
      lastDonationDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const getSingleDonor = async (req: any) => {
  const { id } = req.params;

  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      userName: true,
      role: true,
      image: true,
      contactNo: true,
      bloodType: true,
      location: true,
      availability: true,
      lastDonationDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateMyProfile = async (req: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not founr");
  }

  const update = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: req.body,
  });

  return update;
};

const updateActiveStatus = async (req: any) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log(donorData);
  const updateStatus = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: isActive,
    },
  });
  return updateStatus;
};

const updateUserRole = async (req: any) => {
  const { id } = req.params;
  const { role } = req.body;

  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  
  const updateRole = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: role,
    },
  });
  return updateRole;
};

export const userService = {
  createUser,
  getDonorLists,
  getAllUserForAdmin,
  getMyProfile,
  getSingleDonor,
  updateMyProfile,
  updateActiveStatus,
  updateUserRole
};
