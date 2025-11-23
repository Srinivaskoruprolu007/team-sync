import connectDatabase from "@/config/db.config";
import RoleModel from "@/models/role.model";
import logger from "@/utils/logger";
import { RolePermssions } from "@/utils/roles-permission";
import mongoose from "mongoose";

const seedRoles = async () => {
    logger.info("Seeding roles...");
    try {
        await connectDatabase();
        const session = await mongoose.startSession();
        session.startTransaction();

        logger.info("deleting existing roles...");
        await RoleModel.deleteMany({});

        for (const roleName in RolePermssions) {
            const role = roleName as keyof typeof RolePermssions;
            const permission = RolePermssions[role];

            // check if role already exists
            const existingRole = await RoleModel.findOne({ name: role });
            if (!existingRole) {
                logger.info(`creating role ${role}...`);
                const newRole = new RoleModel({
                    name: role,
                    permissions: permission,
                });
                await newRole.save({ session });
            } else {
                logger.info(`role ${role} already exists...`);
            }
        }

        await session.commitTransaction();
        logger.info("committing transaction...");
        await session.endSession();
        logger.info("ending session...");
        logger.info("Roles seeded successfully");
    } catch (error) {
        logger.error(`Error seeding roles: ${error}`);
    }
};

seedRoles().catch((error) => logger.error(error));
