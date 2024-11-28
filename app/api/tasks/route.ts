import { NextRequest, NextResponse } from "next/server";
import { getTasks } from "./methods/getTasks";
import { createTask } from "./methods/createTask";
import { deleteTasks } from "./methods/deleteTasks";
import { updateTask } from "./methods/updateTask";

export async function GET() {
  const { status, data } = await getTasks();
  return NextResponse.json(data, { status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { status, data } = await createTask(body);
  return NextResponse.json(data, { status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { status, data } = await deleteTasks(body);
  return NextResponse.json(data, { status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { status, data } = await updateTask(body);
  return NextResponse.json(data, { status });
}
