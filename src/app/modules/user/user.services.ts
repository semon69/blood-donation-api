import bcrypt from "bcrypt";
import { prisma } from "../../helpers/prisma";
import { Prisma } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createUser = async (payload: any) => {

  if(payload.password != payload.confirmPassword){
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Password doesn't match") 
  }


  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const role = "user"

  const userData = {
    name: payload.name,
    email: payload.email,
    role,
    password: hashedPassword,
    availability: payload.availability,
    bloodType: payload.bloodType,
    location: payload.location,
  };
  
  const userProfileData = {
    age: payload.age,
    bio: payload.bio,
    lastDonationDate: payload.lastDonationDate,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bloodType: true,
        location: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
        userProfile: true,
      },
    });

    const createUserProfile = await transactionClient.userProfile.create({
      data: {
        userId: createUserData.id,
        ...userProfileData,
      },
    });

    // Update the selected user data to include the created userProfile
    createUserData.userProfile = createUserProfile;

    return createUserData;
  });

  return result;
};

const getDonorLists = async (queryParams: any) => {
  //   const { searchTerm, ...filterData } = params;

  const {
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    searchTerm,
    ...filterData
  } = queryParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const andConditions: Prisma.UserWhereInput[] = [];

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

  //   if (filterDataArray.length > 0) {
  //     andConditions.push({
  //       AND: filterDataArray.map((key) => ({
  //         [key]: {
  //           equals: (filterData as any)[key],
  //         },
  //       })),
  //     });
  //   }
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
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
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

const getMyProfile = async (req:any) => {

  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });
  return result
};

const updateMyProfile = async(req:any) => {
  const update = await prisma.userProfile.update({
    where: {
      userId: req.user.id
    },
    data: req.body
  })
  return update
}

export const userService = {
  createUser,
  getDonorLists,
  getMyProfile,
  updateMyProfile
};
