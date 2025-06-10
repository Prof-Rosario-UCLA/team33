import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List all pantry items (optionally filter by userId)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const items = await prisma.pantryItem.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(items);
}

// POST: Create a new pantry item
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, qty, expirationDate, userId } = data;
  if (!name || !userId) {
    return NextResponse.json({ error: 'Missing name or userId' }, { status: 400 });
  }
  const item = await prisma.pantryItem.create({
    data: {
      name,
      qty: qty ?? 1,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      userId,
    },
  });
  return NextResponse.json(item, { status: 201 });
}

// PATCH: Update a pantry item (by id)
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, name, qty, expirationDate } = data;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const item = await prisma.pantryItem.update({
    where: { id },
    data: {
      name,
      qty,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
    },
  });
  return NextResponse.json(item);
}

// DELETE: Delete a pantry item (by id)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  await prisma.pantryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 