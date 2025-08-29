import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface SalesData {
  date: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  category: string;
}

export interface InventoryData {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
}

export interface SupplierData {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: string[];
  lastOrderDate: string;
  totalOrders: number;
}

export interface UserData {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
}

// CSV Export Functions
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header.toLowerCase().replace(/\s+/g, '')];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Excel Export Functions
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Fallback basic table function
const createBasicTable = (doc: jsPDF, headers: string[], data: string[][], startY: number) => {
  let currentY = startY;
  const lineHeight = 6;
  const columnWidth = 25;
  
  // Add headers
  doc.setFontSize(10);
  headers.forEach((header, index) => {
    doc.text(header, 14 + (index * columnWidth), currentY);
  });
  
  currentY += lineHeight;
  
  // Add line under headers
  doc.line(14, currentY, 14 + (headers.length * columnWidth), currentY);
  currentY += 2;
  
  // Add data rows
  doc.setFontSize(8);
  data.forEach((row) => {
    row.forEach((cell, index) => {
      const text = cell?.toString() || '';
      doc.text(text.substring(0, 20), 14 + (index * columnWidth), currentY);
    });
    currentY += lineHeight;
    
    // Add new page if needed
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
  });
};

// PDF Export Functions
export const exportToPDF = (
  data: any[], 
  filename: string, 
  title: string, 
  headers: string[],
  dateRange?: string
) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    
    // Add date range if provided
    if (dateRange) {
      doc.setFontSize(10);
      doc.text(`Period: ${dateRange}`, 14, 32);
    }
    
    // Add generation date
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, dateRange ? 38 : 32);
    
    // Prepare table data
    const tableData = data.map(row => 
      headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '');
        const value = row[key];
        if (typeof value === 'number' && (key.includes('price') || key.includes('total'))) {
          return `$${value.toFixed(2)}`;
        }
        return value?.toString() || '';
      })
    );
    
    // Try to use autoTable - with fallback to basic table
    try {
      // Check if autoTable is available and callable
      if (typeof autoTable === 'function') {
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: dateRange ? 45 : 40,
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [3, 2, 19], // Primary color
            textColor: 255,
          },
        });
      } else {
        // Fallback to basic text-based table
        createBasicTable(doc, headers, tableData, dateRange ? 45 : 40);
      }
    } catch (tableError) {
      console.warn('AutoTable failed, using basic table:', tableError);
      createBasicTable(doc, headers, tableData, dateRange ? 45 : 40);
    }
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF report');
  }
};

// Sales Report Generators
export const generateSalesReport = (
  salesData: SalesData[], 
  period: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'custom',
  format: 'pdf' | 'excel' | 'csv',
  dateRange?: string
) => {
  const headers = ['Date', 'Product', 'Category', 'Quantity', 'Unit Price', 'Total'];
  const filename = `sales-report-${period}-${new Date().toISOString().split('T')[0]}`;
  const title = `Sales Report - ${period.charAt(0).toUpperCase() + period.slice(1)}`;
  
  const processedData = salesData.map(item => ({
    date: item.date,
    product: item.product,
    category: item.category,
    quantity: item.quantity,
    unitprice: item.price,
    total: item.total
  }));
  
  switch (format) {
    case 'pdf':
      exportToPDF(processedData, filename, title, headers, dateRange);
      break;
    case 'excel':
      exportToExcel(processedData, filename, 'Sales Data');
      break;
    case 'csv':
      exportToCSV(processedData, filename, headers);
      break;
  }
};

// Inventory Report Generator
export const generateInventoryReport = (
  inventoryData: InventoryData[], 
  format: 'pdf' | 'excel' | 'csv'
) => {
  const headers = ['Product Name', 'Category', 'Current Stock', 'Min Stock', 'Max Stock', 'Unit Price', 'Supplier', 'Last Restocked'];
  const filename = `inventory-report-${new Date().toISOString().split('T')[0]}`;
  const title = 'Inventory Report';
  
  const processedData = inventoryData.map(item => ({
    productname: item.name,
    category: item.category,
    currentstock: item.currentStock,
    minstock: item.minStock,
    maxstock: item.maxStock,
    unitprice: item.unitPrice,
    supplier: item.supplier,
    lastrestocked: item.lastRestocked
  }));
  
  switch (format) {
    case 'pdf':
      exportToPDF(processedData, filename, title, headers);
      break;
    case 'excel':
      exportToExcel(processedData, filename, 'Inventory');
      break;
    case 'csv':
      exportToCSV(processedData, filename, headers);
      break;
  }
};

// Supplier Report Generator
export const generateSupplierReport = (
  supplierData: SupplierData[], 
  format: 'pdf' | 'excel' | 'csv'
) => {
  const headers = ['Supplier Name', 'Contact Person', 'Email', 'Phone', 'Address', 'Products Supplied', 'Last Order', 'Total Orders'];
  const filename = `supplier-report-${new Date().toISOString().split('T')[0]}`;
  const title = 'Supplier Report';
  
  const processedData = supplierData.map(item => ({
    suppliername: item.name,
    contactperson: item.contact,
    email: item.email,
    phone: item.phone,
    address: item.address,
    productssupplied: item.productsSupplied.join(', '),
    lastorder: item.lastOrderDate,
    totalorders: item.totalOrders
  }));
  
  switch (format) {
    case 'pdf':
      exportToPDF(processedData, filename, title, headers);
      break;
    case 'excel':
      exportToExcel(processedData, filename, 'Suppliers');
      break;
    case 'csv':
      exportToCSV(processedData, filename, headers);
      break;
  }
};

// User Report Generator
export const generateUserReport = (
  userData: UserData[], 
  format: 'pdf' | 'excel' | 'csv'
) => {
  const headers = ['Username', 'Full Name', 'Email', 'Role', 'Last Login', 'Status'];
  const filename = `user-report-${new Date().toISOString().split('T')[0]}`;
  const title = 'User Management Report';
  
  const processedData = userData.map(item => ({
    username: item.username,
    fullname: item.fullName,
    email: item.email,
    role: item.role,
    lastlogin: item.lastLogin,
    status: item.status
  }));
  
  switch (format) {
    case 'pdf':
      exportToPDF(processedData, filename, title, headers);
      break;
    case 'excel':
      exportToExcel(processedData, filename, 'Users');
      break;
    case 'csv':
      exportToCSV(processedData, filename, headers);
      break;
  }
};

// Chart Export Function
export const exportChartAsImage = async (chartId: string, filename: string) => {
  const html2canvas = (await import('html2canvas')).default;
  const chartElement = document.getElementById(chartId);
  
  if (chartElement) {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
};

// Summary Statistics Calculator
export const calculateSalesSummary = (salesData: SalesData[]) => {
  const totalRevenue = salesData.reduce((sum, item) => sum + item.total, 0);
  const totalQuantity = salesData.reduce((sum, item) => sum + item.quantity, 0);
  const averageOrderValue = totalRevenue / salesData.length;
  const topProduct = salesData.reduce((prev, current) => 
    prev.total > current.total ? prev : current
  );
  
  return {
    totalRevenue,
    totalQuantity,
    averageOrderValue,
    topProduct: topProduct.product,
    totalTransactions: salesData.length
  };
};