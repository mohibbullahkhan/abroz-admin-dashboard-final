import { NextResponse } from 'next/server';

// Mock in-memory database since no Mongoose models are connected yet.
// Note: This will reset on server restart.
let mockCustomers: any[] = [];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Filter by search
    let filtered = mockCustomers;
    if (search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) || 
        (c.mobileNumber && c.mobileNumber.includes(search))
      );
    }
    
    // Pagination
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      success: true,
      message: "Customers retrieved successfully",
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get Customers Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to get customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobileNumber } = body;

    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json({ success: false, message: 'Name must be between 2 and 100 characters' }, { status: 400 });
    }
    if (!mobileNumber) {
      return NextResponse.json({ success: false, message: 'Mobile number is required' }, { status: 400 });
    }
    
    // Check uniqueness
    const exists = mockCustomers.find(c => c.mobileNumber === mobileNumber);
    if (exists) {
      return NextResponse.json({ success: false, message: 'Mobile number must be unique' }, { status: 400 });
    }

    const newCustomer = {
      _id: Math.random().toString(36).substring(7),
      name,
      mobileNumber,
      email: `${name.replace(/\s+/g, '').toLowerCase()}@example.com`,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockCustomers.push(newCustomer);
    
    return NextResponse.json({
      success: true,
      message: "Customer created successfully",
      data: newCustomer
    }, { status: 201 });
  } catch (error) {
    console.error('Create Customer Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create customer' }, { status: 500 });
  }
}

// Function to share the mock data with the [id] route (for testing purposes only)
export const getMockCustomers = () => mockCustomers;
export const setMockCustomers = (newArr: any[]) => { mockCustomers = newArr; }
