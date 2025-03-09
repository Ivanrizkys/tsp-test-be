import { User } from "./user-model.js";
import { UserRepository } from "./user-repository.js";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getOperators(): Promise<User[]> {
    const result = await this.userRepository.getUserByRoleId(2);
    return result;
  }
}
