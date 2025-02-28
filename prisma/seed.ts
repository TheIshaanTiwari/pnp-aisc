import { PrismaClient } from '@prisma/client';
import { TransportMode } from '@/types/enums';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.route.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.supplier.deleteMany();

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Tech Components Ltd',
        latitude: 37.7749,
        longitude: -122.4194,
        address: '123 Tech Street, San Francisco, CA',
        contactPerson: 'John Smith',
        email: 'john@techcomponents.com',
        phone: '+1-555-0123',
        reliabilityRating: 4.5,
        leadTime: 14,
        qualityRating: 4.2,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Global Electronics',
        latitude: 40.7128,
        longitude: -74.0060,
        address: '456 Innovation Ave, New York, NY',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@globalelectronics.com',
        phone: '+1-555-0124',
        reliabilityRating: 4.8,
        leadTime: 10,
        qualityRating: 4.7,
      },
    }),
  ]);

  // Create warehouses
  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        name: 'West Coast Distribution Center',
        latitude: 34.0522,
        longitude: -118.2437,
        address: '789 Warehouse Blvd, Los Angeles, CA',
        capacity: 10000,
        utilizationRate: 0.75,
        operatingCosts: 50000,
      },
    }),
    prisma.warehouse.create({
      data: {
        name: 'East Coast Hub',
        latitude: 39.9526,
        longitude: -75.1652,
        address: '321 Storage Lane, Philadelphia, PA',
        capacity: 8000,
        utilizationRate: 0.65,
        operatingCosts: 45000,
      },
    }),
  ]);

  // Create inventory items
  const inventory = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        name: 'Microprocessors',
        sku: 'CPU-001',
        category: 'Electronics',
        quantity: 1000,
        reorderPoint: 200,
        unitPrice: 150.00,
        supplierId: suppliers[0].id,
        warehouseId: warehouses[0].id,
        supplyRisk: 0.7,
        businessImpact: 0.8,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Memory Modules',
        sku: 'RAM-001',
        category: 'Electronics',
        quantity: 2000,
        reorderPoint: 400,
        unitPrice: 75.00,
        supplierId: suppliers[1].id,
        warehouseId: warehouses[1].id,
        supplyRisk: 0.4,
        businessImpact: 0.6,
      },
    }),
  ]);

  // Create routes
  await Promise.all([
    prisma.route.create({
      data: {
        name: 'West Coast Supply Line',
        origin: suppliers[0].id,
        destination: warehouses[0].id,
        distance: 383.5,
        transportMode: 'TRUCK',
        transitTime: 48,
        cost: 1200,
        reliability: 0.95,
      },
    }),
    prisma.route.create({
      data: {
        name: 'East Coast Supply Chain',
        origin: suppliers[1].id,
        destination: warehouses[1].id,
        distance: 97.3,
        transportMode: 'TRUCK',
        transitTime: 24,
        cost: 800,
        reliability: 0.98,
      },
    }),
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 