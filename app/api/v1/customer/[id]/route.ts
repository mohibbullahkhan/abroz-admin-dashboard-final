import { NextResponse } from 'next/server';
import { getMockCustomers, setMockCustomers } from '../route';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const customers = getMockCustomers();
    const customer = customers.find((c: any) => c._id === resolvedParams.id);
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Customer retrieved successfully",
      data: customer
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get customer' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const customers = getMockCustomers();
    const index = customers.findIndex((c: any) => c._id === resolvedParams.id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }
    
    // Check uniqueness if mobileNumber is modified
    if (body.mobileNumber && body.mobileNumber !== customers[index].mobileNumber) {
      const exists = customers.find((c: any) => c.mobileNumber === body.mobileNumber);
      if (exists) {
        return NextResponse.json({ success: false, message: 'Mobile number must be unique' }, { status: 400 });
      }
    }
    
    const updatedCustomer = {
      ...customers[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    customers[index] = updatedCustomer;
    setMockCustomers(customers);
    
    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const customers = getMockCustomers();
    const index = customers.findIndex((c: any) => c._id === resolvedParams.id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }
    
    customers.splice(index, 1);
    setMockCustomers(customers);
    
    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully"
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete customer' }, { status: 500 });
  }
}
