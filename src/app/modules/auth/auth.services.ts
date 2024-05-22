import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { prisma } from "../../helpers/prisma";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(
    payload?.password,
    userData?.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Incorrect Password");
  }

  const token = jwtHelpers.generateToken(
    {
      role: userData?.role,
      email: userData?.email,
      id: userData?.id,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData?.role,
    token,
  };
};

const changePassword = async (req: any) => {

  console.log(req);

  const user = req?.user;
  const payload = req?.body;

  console.log(user);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  if (payload.newPassword != payload.confirmPassword) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Password doesn't match"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );
  
  if (!isPasswordCorrect) {
    throw new Error("Incorrect Password");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

export const authService = {
  loginUser,
  changePassword,
};
