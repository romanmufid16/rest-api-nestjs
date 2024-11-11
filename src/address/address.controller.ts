import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { AddressService } from "./address.service";
import { Auth } from "src/common/auth.decorator";
import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest } from "src/model/address.model";
import { WebResponse } from "src/model/web.model";

@Controller('/api/addresses')
export class AddressController {
  constructor(private addressService: AddressService) { }

  @Post('/create')
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() req: CreateAddressRequest
  ): Promise <WebResponse<AddressResponse>> {
    const result = await this.addressService.create(user, req);
    return {
      data: result
    }
  }

  @Get('/:addressId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number
  ): Promise<WebResponse<AddressResponse>> {
    const req: GetAddressRequest = {
      address_id: addressId,
      contact_id: contactId
    }

    const result = await this.addressService.get(user, req);
    return {
      data: result
    }
  }

  @Put('/:addressId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() req: UpdateAddressRequest
  ): Promise<WebResponse<AddressResponse>> {
    req.contact_id = contactId;
    req.id = addressId;
    const result = await this.addressService.update(user, req);
    return {
      data: result
    };
  }

  @Delete('/:addressId')
  @HttpCode(204)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number
  ): Promise<WebResponse<boolean>> {
    const req: RemoveAddressRequest = {
      address_id: addressId,
      contact_id: contactId
    }
    await this.addressService.remove(user, req);
    return {
      data: true
    }
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number
  ): Promise<WebResponse<AddressResponse[]>> {
    const result = await this.addressService.list(user, contactId);
    return {
      data: result
    }
  }
}