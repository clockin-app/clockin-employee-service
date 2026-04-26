import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.employeeRepo.findOne({
      where: [{ email: dto.email }, { nik: dto.nik }],
    });
    if (existing) throw new ConflictException('Email or NIK already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const employee = this.employeeRepo.create({ ...dto, password: hashed });
    return this.employeeRepo.save(employee);
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Employee[]; total: number }> {
    const [data, total] = await this.employeeRepo.findAndCount({
      where: { is_active: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id, is_active: true },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async findByEmail(email: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { email } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return this.employeeRepo.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    employee.is_active = false;
    await this.employeeRepo.save(employee);
  }
}
