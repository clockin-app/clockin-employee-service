import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Employee } from '../entities/employee.entity';
import { EmployeesService } from '../services/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiHeader({
    name: 'x-employee-id',
    description: 'Injected by Gateway after JWT validation',
    required: true,
  })
  getMe(@Headers('x-employee-id') employeeId: string): Promise<Employee> {
    return this.employeesService.findOne(employeeId);
  }

  @Get('by-email/:email')
  @ApiOperation({
    summary: '[Internal] Get employee by email — used by Auth Service',
  })
  async getByEmail(
    @Param('email') email: string,
  ): Promise<Record<string, unknown>> {
    const employee = await this.employeesService.findByEmail(email);
    return instanceToPlain(employee, { ignoreDecorators: true });
  }

  @Get()
  @ApiOperation({ summary: 'List all active employees (paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ data: Employee[]; total: number }> {
    return this.employeesService.findAll(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return this.employeesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update employee data' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete employee' })
  remove(@Param('id') id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}
