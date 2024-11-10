import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "src/model/contact.model";
import { WebResponse } from "src/model/web.model";
import { Auth } from "src/common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) { }

  @Post('/create')
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() req: CreateContactRequest
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(user, req);
    return {
      data: result
    };
  }

  @Get('/:contactId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.get(user, contactId);
    return {
      data: result
    };
  }

  @Put('/:contactId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() req: UpdateContactRequest
  ): Promise<WebResponse<ContactResponse>> {
    req.id = contactId;
    const result = await this.contactService.update(user, req);

    return {
      data: result
    };
  }

  @Delete('/:contactId')
  @HttpCode(204)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number
  ): Promise<WebResponse<boolean>> {
    await this.contactService.get(user, contactId);
    return {
      data: true
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    const request: SearchContactRequest = {
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 10,
    };
    return this.contactService.search(user, request);
  }
}