import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "../../common/enum/role.enum";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: {
        userId: string;
        mobile: string;
    }): Promise<{
        id: string;
        mobile: string | null;
        createdAt: Date;
        email: string | null;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
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
    updateProfile(user: {
        userId: string;
        mobile: string;
    }, dto: UpdateProfileDto): Promise<{
        message: string;
        data: {
            id: string;
            mobile: string | null;
            createdAt: Date;
            email: string | null;
            username: string | null;
            firstName: string | null;
            lastName: string | null;
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
        createdAt: Date;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        isActive: boolean;
        roles: {
            id: string;
            userId: string;
            roleId: string;
        }[];
    }[] | undefined>;
    getUsersById(id: string): Promise<{
        id: string;
        mobile: string | null;
        createdAt: Date;
        email: string | null;
        username: string | null;
        passwordHash: string | null;
        firstName: string | null;
        lastName: string | null;
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
        createdAt: Date;
        email: string | null;
        username: string | null;
        passwordHash: string | null;
        firstName: string | null;
        lastName: string | null;
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
    updateUserRole(currentUser: {
        userId: string;
    }, userId: string, role: Role): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
}
