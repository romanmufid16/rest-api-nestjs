import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) { }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test'
      }
    });
  }

  async getUser() {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test'
      }
    });
  }


  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('secret123', 10),
        name: 'test',
        token: 'test'
      }
    });
  }
}