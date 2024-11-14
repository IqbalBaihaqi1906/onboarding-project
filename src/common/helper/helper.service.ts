import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseResponseDto } from '../dto/base-response.dto';

@Injectable()
export class HelperService {
  transformToResponse(data: any, statusCode: number): BaseResponseDto {
    return {
      success: true,
      code: statusCode,
      data,
      error: null,
      meta: null,
    };
  }

  transformToPaginatedResponse(
    data: object | any[],
    total: number,
    page: number,
    limit: number,
  ): BaseResponseDto {
    return {
      success: true,
      code: 200,
      data,
      error: null,
      meta: {
        pagination: {
          total,
          page,
          limit,
        },
      },
    };
  }

  setUpdateClause(data: object): Map<string, any> {
    const map = new Map();

    Object.keys(data).forEach((value, index) => {
      map.set(index + 1, { field: value, value: data[value] });
    });

    return map;
  }

  getUpdateFields(dto: object): [string, any][] {
    return Object.entries(dto).filter(([_, value]) => value !== undefined);
  }

  buildSetClause(updateFields: [string, any][]): string {
    return updateFields
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(', ');
  }

  buildUpdateParams(updateFields: [string, any][], identifier: any): any[] {
    return [...updateFields.map(([_, value]) => value), identifier];
  }

  buildUpdateQuery(tableName: string, setClause: string): string {
    return `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE id = $${setClause.split(',').length + 1} RETURNING *
    `;
  }

  prepareUpdate(dto: object, tableName: string, identifier: any) {
    const updateFields = this.getUpdateFields(dto);

    if (updateFields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const setClause = this.buildSetClause(updateFields);
    const params = this.buildUpdateParams(updateFields, identifier);
    const query = this.buildUpdateQuery(tableName, setClause);

    return {
      query,
      params,
      updateFields,
    };
  }
}
