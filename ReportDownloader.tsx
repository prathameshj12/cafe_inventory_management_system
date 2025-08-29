import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Download, FileText, FileSpreadsheet, Image, Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, subMonths, subYears, startOfMonth, endOfMonth, isValid } from "date-fns";
import { cn } from "./ui/utils";
import { 
  generateSalesReport, 
  generateInventoryReport, 
  generateSupplierReport, 
  generateUserReport,
  exportChartAsImage,
  SalesData,
  InventoryData,
  SupplierData,
  UserData
} from "../utils/reportGenerator";
import { toast } from "sonner@2.0.3";

interface ReportDownloaderProps {
  reportType: 'sales' | 'inventory' | 'suppliers' | 'users' | 'chart';
  data?: any[];
  chartId?: string;
  chartTitle?: string;
  className?: string;
}

export function ReportDownloader({ 
  reportType, 
  data = [], 
  chartId, 
  chartTitle,
  className 
}: ReportDownloaderProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'custom'>('monthly');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const getSampleData = () => {
    switch (reportType) {
      case 'sales':
        return generateSampleSalesData();
      case 'inventory':
        return generateSampleInventoryData();
      case 'suppliers':
        return generateSampleSupplierData();
      case 'users':
        return generateSampleUserData();
      default:
        return [];
    }
  };

  const generateSampleSalesData = (): SalesData[] => [
    { date: '2024-01-15', product: 'Espresso', quantity: 25, price: 3.50, total: 87.50, category: 'Coffee' },
    { date: '2024-01-15', product: 'Cappuccino', quantity: 18, price: 4.25, total: 76.50, category: 'Coffee' },
    { date: '2024-01-15', product: 'Croissant', quantity: 12, price: 2.75, total: 33.00, category: 'Pastries' },
    { date: '2024-01-16', product: 'Latte', quantity: 22, price: 4.50, total: 99.00, category: 'Coffee' },
    { date: '2024-01-16', product: 'Muffin', quantity: 8, price: 3.25, total: 26.00, category: 'Pastries' },
  ];

  const generateSampleInventoryData = (): InventoryData[] => [
    { id: '1', name: 'Arabica Coffee Beans', category: 'Coffee Beans', currentStock: 45, minStock: 20, maxStock: 100, unitPrice: 12.50, supplier: 'Premium Coffee Co', lastRestocked: '2024-01-10' },
    { id: '2', name: 'Whole Milk', category: 'Dairy', currentStock: 15, minStock: 10, maxStock: 50, unitPrice: 3.25, supplier: 'Fresh Dairy Ltd', lastRestocked: '2024-01-14' },
    { id: '3', name: 'Vanilla Syrup', category: 'Syrups', currentStock: 8, minStock: 5, maxStock: 25, unitPrice: 8.75, supplier: 'Flavor House', lastRestocked: '2024-01-12' },
  ];

  const generateSampleSupplierData = (): SupplierData[] => [
    { id: '1', name: 'Premium Coffee Co', contact: 'John Smith', email: 'john@premiumcoffee.com', phone: '+1-555-0123', address: '123 Coffee St, Bean City', productsSupplied: ['Arabica Beans', 'Robusta Beans'], lastOrderDate: '2024-01-10', totalOrders: 25 },
    { id: '2', name: 'Fresh Dairy Ltd', contact: 'Sarah Johnson', email: 'sarah@freshdairy.com', phone: '+1-555-0456', address: '456 Dairy Lane, Milk Town', productsSupplied: ['Whole Milk', 'Almond Milk'], lastOrderDate: '2024-01-14', totalOrders: 18 },
  ];

  const generateSampleUserData = (): UserData[] => [
    { id: '1', username: 'admin', fullName: 'Admin User', email: 'admin@coffeeshop.com', role: 'Admin', lastLogin: '2024-01-15 09:30', status: 'Active' },
    { id: '2', username: 'manager01', fullName: 'John Manager', email: 'john@coffeeshop.com', role: 'Manager', lastLogin: '2024-01-15 08:45', status: 'Active' },
    { id: '3', username: 'staff01', fullName: 'Jane Staff', email: 'jane@coffeeshop.com', role: 'Staff', lastLogin: '2024-01-14 16:20', status: 'Active' },
  ];

  const getDateRangeForPeriod = (selectedPeriod: string) => {
    const today = new Date();
    switch (selectedPeriod) {
      case 'monthly':
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
          label: format(today, 'MMMM yyyy')
        };
      case 'quarterly':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        return {
          from: quarterStart,
          to: quarterEnd,
          label: `Q${Math.floor(today.getMonth() / 3) + 1} ${today.getFullYear()}`
        };
      case 'semi-annual':
        const halfStart = new Date(today.getFullYear(), today.getMonth() < 6 ? 0 : 6, 1);
        const halfEnd = new Date(halfStart.getFullYear(), halfStart.getMonth() + 6, 0);
        return {
          from: halfStart,
          to: halfEnd,
          label: `${today.getMonth() < 6 ? 'H1' : 'H2'} ${today.getFullYear()}`
        };
      case 'annual':
        return {
          from: new Date(today.getFullYear(), 0, 1),
          to: new Date(today.getFullYear(), 11, 31),
          label: today.getFullYear().toString()
        };
      case 'custom':
        return dateRange && dateRange.from && dateRange.to && 
               isValid(dateRange.from) && isValid(dateRange.to) ? {
          from: dateRange.from,
          to: dateRange.to,
          label: `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
        } : null;
      default:
        return null;
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      const reportData = data.length > 0 ? data : getSampleData();
      
      if (reportType === 'chart' && chartId) {
        await exportChartAsImage(chartId, chartTitle || 'chart');
        toast.success('Chart exported successfully!');
      } else {
        const dateRangeInfo = getDateRangeForPeriod(period);
        const dateRangeLabel = dateRangeInfo?.label || 'All Time';
        
        switch (reportType) {
          case 'sales':
            generateSalesReport(reportData as SalesData[], period, exportFormat, dateRangeLabel);
            break;
          case 'inventory':
            generateInventoryReport(reportData as InventoryData[], exportFormat);
            break;
          case 'suppliers':
            generateSupplierReport(reportData as SupplierData[], exportFormat);
            break;
          case 'users':
            generateUserReport(reportData as UserData[], exportFormat);
            break;
        }
        
        toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully!`);
      }
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormatIcon = (selectedFormat: string) => {
    switch (selectedFormat) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download {reportType === 'chart' ? 'Chart' : 'Report'}
        </CardTitle>
        <CardDescription>
          Export {reportType} data in your preferred format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reportType !== 'chart' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Format</label>
              <Select value={exportFormat} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'sales' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Period</label>
                  <Select value={period} onValueChange={(value: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'custom') => setPeriod(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {period === 'custom' && (
                  <div>
                    <label className="block mb-2">Date Range</label>
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left",
                            !dateRange && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from && isValid(dateRange.from) ? (
                            dateRange.to && isValid(dateRange.to) ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div>
                  <label className="block mb-2">Preview</label>
                  <div className="flex flex-wrap gap-2">
                    {period !== 'custom' && (
                      <Badge variant="secondary">
                        {getDateRangeForPeriod(period)?.label}
                      </Badge>
                    )}
                    {period === 'custom' && dateRange && dateRange.from && dateRange.to && 
                     isValid(dateRange.from) && isValid(dateRange.to) && (
                      <Badge variant="secondary">
                        {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {exportFormat.toUpperCase()} Format
                    </Badge>
                    <Badge variant="outline">
                      {data.length > 0 ? data.length : getSampleData().length} Records
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {reportType === 'chart' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <Image className="h-4 w-4" />
              <span className="text-sm">Chart will be exported as PNG image</span>
            </div>
            {chartTitle && (
              <Badge variant="secondary">{chartTitle}</Badge>
            )}
          </div>
        )}

        <Button 
          onClick={handleDownload} 
          className="w-full"
          disabled={isGenerating || (period === 'custom' && reportType === 'sales' && 
                    (!dateRange || !dateRange.from || !dateRange.to || !isValid(dateRange.from) || !isValid(dateRange.to)))}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {reportType === 'chart' ? <Image className="h-4 w-4" /> : getFormatIcon(exportFormat)}
              Download {reportType === 'chart' ? 'Chart' : 'Report'}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}