import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "../../common/enum/role.enum";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        mobile: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        createdAt: Date;
        username: string | null;
        gender: string | null;
        birthDate: Date | null;
        avatar: string | null;
        githubLink: string | null;
        linkedInLink: string | null;
        country: string | null;
        city: string | null;
        jobStatus: string | null;
        description: string | null;
        whatIveBeenWorkingOn: string | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        data: {
            id: string;
            mobile: string | null;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            createdAt: Date;
            username: string | null;
            gender: string | null;
            birthDate: Date | null;
            avatar: string | null;
            githubLink: string | null;
            linkedInLink: string | null;
            country: string | null;
            city: string | null;
            jobStatus: string | null;
            description: string | null;
            whatIveBeenWorkingOn: string | null;
        };
    }>;
    getUsers(): Promise<{
        id: string;
        mobile: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        createdAt: Date;
        isActive: boolean;
        roles: {
            id: string;
            userId: string;
            roleId: string;
        }[];
    }[] | undefined>;
    getUserById(id: string): Promise<{
        id: string;
        mobile: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        createdAt: Date;
        username: string | null;
        passwordHash: string | null;
        gender: string | null;
        birthDate: Date | null;
        avatar: string | null;
        githubLink: string | null;
        linkedInLink: string | null;
        country: string | null;
        city: string | null;
        jobStatus: string | null;
        description: string | null;
        whatIveBeenWorkingOn: string | null;
        isActive: boolean;
        isMobileVerified: boolean;
        phoneVerifiedAt: Date | null;
        updatedAt: Date;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        mobile: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        createdAt: Date;
        username: string | null;
        passwordHash: string | null;
        gender: string | null;
        birthDate: Date | null;
        avatar: string | null;
        githubLink: string | null;
        linkedInLink: string | null;
        country: string | null;
        city: string | null;
        jobStatus: string | null;
        description: string | null;
        whatIveBeenWorkingOn: string | null;
        isActive: boolean;
        isMobileVerified: boolean;
        phoneVerifiedAt: Date | null;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    updateUserRole(adminId: string, targetUserId: string, role: Role): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
}
