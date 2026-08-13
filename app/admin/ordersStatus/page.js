"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  ClipboardList,
  CalendarDays,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";


// ======================================================
// API
// ======================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


// ======================================================
// Animation
// ======================================================

const containerVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.35,
    },
  },
};


// ======================================================
// Helpers
// ======================================================

const statusConfig = {
  New: {
    label: "طلب جديد",
    icon: ClipboardList,
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },

  Preparing: {
    label: "قيد التجهيز",
    icon: Clock3,
    className:
      "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  },

  Completed: {
    label: "مكتمل",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },

  Cancelled: {
    label: "ملغي",
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  },
};


function formatPrice(value) {
  return new Intl.NumberFormat("ar-SA").format(value);
}


function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}


// ======================================================
// Status Badge
// ======================================================

function OrderStatus({ status }) {
  const config = statusConfig[status] || statusConfig.New;

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-1 font-medium",
        config.className
      )}
    >
      <Icon className="size-3.5" />

      {config.label}
    </Badge>
  );
}


// ======================================================
// Stats Card
// ======================================================

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {value}
              </p>
            </div>

            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                color
              )}
            >
              <Icon className="size-5" />
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


// ======================================================
// Order Card - Mobile
// ======================================================

function OrderCard({
  order,
  onView,
  onDelete,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <Card className="border-border/60 shadow-sm">

        <CardContent className="p-4">

          {/* Header */}

          <div className="flex items-start justify-between gap-3">

            <div>
              <p className="text-xs text-muted-foreground">
                رقم الطلب
              </p>

              <p className="font-bold">
                #{order.id}
              </p>
            </div>

            <OrderStatus status={order.status} />

          </div>


          <Separator className="my-4" />


          {/* Customer */}

          <div>
            <p className="font-semibold">
              {order.customer?.name}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {order.customer?.phone}
            </p>
          </div>


          {/* Info */}

          <div className="mt-4 grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                المنتجات
              </p>

              <p className="mt-1 font-semibold">
                {order.items?.length || 0} منتجات
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                الإجمالي
              </p>

              <p className="mt-1 font-semibold">
                {formatPrice(order.total)}
              </p>
            </div>

          </div>


          {/* Footer */}

          <div className="mt-4 flex items-center justify-between gap-3">

            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>

            <div className="flex gap-2">

              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(order)}
              >
                <Eye className="me-2 size-4" />
                التفاصيل
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(order)}
              >
                <Trash2 className="size-4" />
              </Button>

            </div>

          </div>

        </CardContent>

      </Card>
    </motion.div>
  );
}


// ======================================================
// Skeleton
// ======================================================

function OrderSkeleton() {
  return (
    <div className="space-y-3">

      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-xl bg-muted"
        />
      ))}

    </div>
  );
}


// ======================================================
// Page
// ======================================================

export default function OrdersPage() {

  // --------------------------------------------------
  // Orders
  // --------------------------------------------------

  const [orders, setOrders] = useState([]);

  const [stats, setStats] = useState({
    all: 0,
    new: 0,
    preparing: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    todayRevenue: 0,
  });


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);


  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const [status, setStatus] = useState("all");

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("newest");

  const [dateFrom, setDateFrom] = useState();

  const [dateTo, setDateTo] = useState();


  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });


  // --------------------------------------------------
  // Details
  // --------------------------------------------------

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [detailsLoading, setDetailsLoading] = useState(false);


  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const [deleteOrderData, setDeleteOrderData] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);


  // --------------------------------------------------
  // Fetch Stats
  // --------------------------------------------------

  const fetchStats = useCallback(async () => {

    try {

      const response = await fetch(
        `${API_URL}/admin/orders/stats`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }

    } catch (error) {

      console.error(
        "Failed to fetch order stats:",
        error
      );

    }

  }, []);


  // --------------------------------------------------
  // Fetch Orders
  // --------------------------------------------------

  const fetchOrders = useCallback(
    async (showRefresh = false) => {

      try {

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }


        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", "20");

        if (status !== "all") {
          params.set("status", status);
        }

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (sort) {
          params.set("sort", sort);
        }

        if (dateFrom) {
          params.set(
            "dateFrom",
            dateFrom.toISOString().split("T")[0]
          );
        }

        if (dateTo) {
          params.set(
            "dateTo",
            dateTo.toISOString().split("T")[0]
          );
        }


        const response = await fetch(
          `${API_URL}/admin/orders?${params.toString()}`,
          {
            cache: "no-store",
          }
        );


        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }


        const result = await response.json();


        if (result.success) {

          setOrders(result.data);

          setPagination(result.pagination);

        }

      } catch (error) {

        console.error(
          "Failed to fetch orders:",
          error
        );

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },
    [
      page,
      status,
      search,
      sort,
      dateFrom,
      dateTo,
    ]
  );


  // --------------------------------------------------
  // Initial
  // --------------------------------------------------

  useEffect(() => {

    fetchStats();

  }, [fetchStats]);


  useEffect(() => {

    const timeout = setTimeout(() => {
      fetchOrders();
    }, 250);

    return () => clearTimeout(timeout);

  }, [fetchOrders]);


  // --------------------------------------------------
  // Change Status
  // --------------------------------------------------

  const updateStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );


      const result = await response.json();


      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update status"
        );
      }


      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
            }
          : prev
      );


      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );


      fetchStats();

    } catch (error) {

      console.error(
        "Failed to update status:",
        error
      );

    }

  };


  // --------------------------------------------------
  // Open Order
  // --------------------------------------------------

  const openOrder = async (order) => {

    setDetailsOpen(true);

    setDetailsLoading(true);

    setSelectedOrder(null);


    try {

      const response = await fetch(
        `${API_URL}/admin/orders/${order.id}`,
        {
          cache: "no-store",
        }
      );


      const result = await response.json();


      if (result.success) {
        setSelectedOrder(result.data);
      }

    } catch (error) {

      console.error(
        "Failed to fetch order:",
        error
      );

    } finally {

      setDetailsLoading(false);

    }

  };


  // --------------------------------------------------
  // Delete Order
  // --------------------------------------------------

  const deleteOrder = async () => {

    if (!deleteOrderData) return;


    try {

      setDeleteLoading(true);


      const response = await fetch(
        `${API_URL}/admin/orders/${deleteOrderData.id}`,
        {
          method: "DELETE",
        }
      );


      const result = await response.json();


      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete order"
        );
      }


      setDeleteOrderData(null);

      setOrders((current) =>
        current.filter(
          (order) =>
            order.id !== deleteOrderData.id
        )
      );


      fetchStats();

    } catch (error) {

      console.error(
        "Failed to delete order:",
        error
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const resetFilters = () => {

    setStatus("all");

    setSearch("");

    setSort("newest");

    setDateFrom(undefined);

    setDateTo(undefined);

    setPage(1);

  };


  // ==================================================
  // Render
  // ==================================================

  return (

    <div
      dir="rtl"
      className="min-h-screen bg-background"
    >

      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">


        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -12,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >

          <div>

            <div className="flex items-center gap-2">

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

                <ShoppingBag className="size-5" />

              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  الطلبات
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  إدارة ومتابعة جميع طلبات العملاء
                </p>

              </div>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              onClick={() => {
                fetchOrders(true);
                fetchStats();
              }}
              disabled={refreshing}
            >

              <RefreshCw
                className={cn(
                  "me-2 size-4",
                  refreshing &&
                    "animate-spin"
                )}
              />

              تحديث

            </Button>


            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  variant="outline"
                  size="icon"
                >
                  <MoreHorizontal className="size-4" />
                </Button>

              </DropdownMenuTrigger>


              <DropdownMenuContent
                align="end"
                className="w-48"
              >

                <DropdownMenuItem
                  onClick={resetFilters}
                >
                  <RotateCcw className="me-2 size-4" />
                  إعادة ضبط الفلاتر
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="me-2 size-4" />
                  إدارة سجل الطلبات
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>

        </motion.div>


        {/* ==================================================
            STATS
        ================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >

          <StatCard
            title="جميع الطلبات"
            value={formatPrice(stats.all)}
            icon={ShoppingBag}
            color="bg-primary/10 text-primary"
          />

          <StatCard
            title="طلبات جديدة"
            value={formatPrice(stats.new)}
            icon={ClipboardList}
            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />

          <StatCard
            title="قيد التجهيز"
            value={formatPrice(stats.preparing)}
            icon={Clock3}
            color="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          />

          <StatCard
            title="مكتملة"
            value={formatPrice(stats.completed)}
            icon={CheckCircle2}
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />

          <StatCard
            title="ملغاة"
            value={formatPrice(stats.cancelled)}
            icon={XCircle}
            color="bg-red-500/10 text-red-600 dark:text-red-400"
          />

        </motion.div>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <Card className="mb-6 border-border/60 shadow-sm">

          <CardContent className="p-3 sm:p-4">

            <div className="flex flex-col gap-3 lg:flex-row">


              {/* Search */}

              <div className="relative flex-1">

                <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="ابحث باسم العميل أو رقم الهاتف..."
                  className="h-10 pe-3 ps-10"
                />

              </div>


              {/* Sort */}

              <Select
                value={sort}
                onValueChange={(value) => {
                  setSort(value);
                  setPage(1);
                }}
              >

                <SelectTrigger className="w-full lg:w-[180px]">

                  <ArrowUpDown className="me-2 size-4 text-muted-foreground" />

                  <SelectValue />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="newest">
                    الأحدث أولًا
                  </SelectItem>

                  <SelectItem value="oldest">
                    الأقدم أولًا
                  </SelectItem>

                  <SelectItem value="total_high">
                    الأعلى سعرًا
                  </SelectItem>

                  <SelectItem value="total_low">
                    الأقل سعرًا
                  </SelectItem>

                </SelectContent>

              </Select>


              {/* Date From */}

              <Popover>

                <PopoverTrigger asChild>

                  <Button
                    variant="outline"
                    className="justify-start lg:w-[170px]"
                  >

                    <CalendarDays className="me-2 size-4" />

                    {dateFrom
                      ? dateFrom.toLocaleDateString(
                          "ar-SA"
                        )
                      : "من التاريخ"}

                  </Button>

                </PopoverTrigger>


                <PopoverContent
                  align="end"
                  className="w-auto p-0"
                >

                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => {
                      setDateFrom(date);
                      setPage(1);
                    }}
                  />

                </PopoverContent>

              </Popover>


              {/* Date To */}

              <Popover>

                <PopoverTrigger asChild>

                  <Button
                    variant="outline"
                    className="justify-start lg:w-[170px]"
                  >

                    <CalendarDays className="me-2 size-4" />

                    {dateTo
                      ? dateTo.toLocaleDateString(
                          "ar-SA"
                        )
                      : "إلى التاريخ"}

                  </Button>

                </PopoverTrigger>


                <PopoverContent
                  align="end"
                  className="w-auto p-0"
                >

                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => {
                      setDateTo(date);
                      setPage(1);
                    }}
                  />

                </PopoverContent>

              </Popover>


              {/* Reset */}

              <Button
                variant="ghost"
                onClick={resetFilters}
              >

                <RotateCcw className="me-2 size-4" />

                تصفية

              </Button>

            </div>

          </CardContent>

        </Card>


        {/* ==================================================
            TABS
        ================================================== */}

        <div className="mb-5 overflow-x-auto">

          <Tabs
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >

            <TabsList className="h-auto w-max gap-1 bg-muted/60 p-1">

              <TabsTrigger
                value="all"
                className="gap-2 px-4 py-2"
              >
                الكل
                <span className="text-xs text-muted-foreground">
                  {stats.all}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="New"
                className="gap-2 px-4 py-2"
              >
                جديدة
                <span className="text-xs text-muted-foreground">
                  {stats.new}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="Preparing"
                className="gap-2 px-4 py-2"
              >
                التجهيز
                <span className="text-xs text-muted-foreground">
                  {stats.preparing}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="Completed"
                className="gap-2 px-4 py-2"
              >
                مكتملة
                <span className="text-xs text-muted-foreground">
                  {stats.completed}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="Cancelled"
                className="gap-2 px-4 py-2"
              >
                ملغاة
                <span className="text-xs text-muted-foreground">
                  {stats.cancelled}
                </span>
              </TabsTrigger>

            </TabsList>

          </Tabs>

        </div>


        {/* ==================================================
            CONTENT
        ================================================== */}

        {loading ? (

          <OrderSkeleton />

        ) : orders.length === 0 ? (

          <Card className="border-dashed">

            <CardContent className="flex min-h-[320px] flex-col items-center justify-center text-center">

              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">

                <ShoppingBag className="size-7 text-muted-foreground" />

              </div>

              <h3 className="text-lg font-semibold">
                لا توجد طلبات
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                لم يتم العثور على طلبات تطابق
                الفلاتر الحالية.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={resetFilters}
              >
                إعادة ضبط الفلاتر
              </Button>

            </CardContent>

          </Card>

        ) : (

          <>

            {/* ==================================================
                MOBILE
            ================================================== */}

            <div className="grid gap-3 md:hidden">

              <AnimatePresence mode="popLayout">

                {orders.map((order) => (

                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={openOrder}
                    onDelete={setDeleteOrderData}
                  />

                ))}

              </AnimatePresence>

            </div>


            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <Card className="hidden overflow-hidden border-border/60 shadow-sm md:block">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="border-b bg-muted/40">

                    <tr className="text-right">

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        الطلب
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        العميل
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        المنتجات
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        الإجمالي
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        الحالة
                      </th>

                      <th className="px-5 py-4 font-medium text-muted-foreground">
                        التاريخ
                      </th>

                      <th className="w-12 px-5 py-4" />

                    </tr>

                  </thead>


                  <tbody className="divide-y">

                    <AnimatePresence mode="popLayout">

                      {orders.map((order) => (

                        <motion.tr
                          key={order.id}
                          layout
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          className="group transition-colors hover:bg-muted/30"
                        >

                          {/* Order */}

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                openOrder(order)
                              }
                              className="font-semibold hover:text-primary"
                            >
                              #{order.id}
                            </button>

                          </td>


                          {/* Customer */}

                          <td className="px-5 py-4">

                            <div>

                              <p className="font-medium">
                                {order.customer?.name}
                              </p>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {order.customer?.phone}
                              </p>

                            </div>

                          </td>


                          {/* Items */}

                          <td className="px-5 py-4">

                            <span className="text-muted-foreground">
                              {order.items?.length || 0} منتجات
                            </span>

                          </td>


                          {/* Total */}

                          <td className="px-5 py-4">

                            <span className="font-semibold">
                              {formatPrice(order.total)}
                            </span>

                          </td>


                          {/* Status */}

                          <td className="px-5 py-4">

                            <OrderStatus
                              status={order.status}
                            />

                          </td>


                          {/* Date */}

                          <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">

                            {formatDate(
                              order.createdAt
                            )}

                          </td>


                          {/* Actions */}

                          <td className="px-5 py-4">

                            <DropdownMenu>

                              <DropdownMenuTrigger
                                asChild
                              >

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="opacity-70 group-hover:opacity-100"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>

                              </DropdownMenuTrigger>


                              <DropdownMenuContent
                                align="end"
                              >

                                <DropdownMenuItem
                                  onClick={() =>
                                    openOrder(order)
                                  }
                                >

                                  <Eye className="me-2 size-4" />

                                  عرض التفاصيل

                                </DropdownMenuItem>


                                <DropdownMenuSeparator />


                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() =>
                                    setDeleteOrderData(
                                      order
                                    )
                                  }
                                >

                                  <Trash2 className="me-2 size-4" />

                                  حذف الطلب

                                </DropdownMenuItem>

                              </DropdownMenuContent>

                            </DropdownMenu>

                          </td>

                        </motion.tr>

                      ))}

                    </AnimatePresence>

                  </tbody>

                </table>

              </div>

            </Card>


            {/* ==================================================
                PAGINATION
            ================================================== */}

            <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">

              <p className="text-sm text-muted-foreground">

                إجمالي الطلبات:

                <span className="mx-1 font-medium text-foreground">
                  {pagination.total}
                </span>

              </p>


              <div className="flex items-center gap-2">

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.max(current - 1, 1)
                    )
                  }
                >

                  <ChevronRight className="me-1 size-4" />

                  السابق

                </Button>


                <div className="flex h-9 min-w-9 items-center justify-center rounded-md border bg-muted/50 px-3 text-sm font-medium">

                  {pagination.page}

                </div>


                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    setPage(
                      (current) => current + 1
                    )
                  }
                >

                  التالي

                  <ChevronLeft className="ms-1 size-4" />

                </Button>

              </div>

            </div>

          </>

        )}

      </main>


      {/* ======================================================
          ORDER DETAILS SHEET
      ====================================================== */}

      <Sheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >

        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-lg"
        >

          <SheetHeader className="text-right">

            <SheetTitle>
              تفاصيل الطلب
              {selectedOrder &&
                ` #${selectedOrder.id}`}
            </SheetTitle>

            <SheetDescription>
              معلومات الطلب والعميل والمنتجات
            </SheetDescription>

          </SheetHeader>


          {detailsLoading ? (

            <div className="mt-8 space-y-4">

              <div className="h-20 animate-pulse rounded-xl bg-muted" />

              <div className="h-40 animate-pulse rounded-xl bg-muted" />

              <div className="h-24 animate-pulse rounded-xl bg-muted" />

            </div>

          ) : selectedOrder ? (

            <div className="mt-6 space-y-6">


              {/* Customer */}

              <div className="rounded-2xl border bg-muted/30 p-4">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="font-semibold">
                      {selectedOrder.customer?.name}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedOrder.customer?.phone}
                    </p>

                  </div>

                  <OrderStatus
                    status={
                      selectedOrder.status
                    }
                  />

                </div>


                {selectedOrder.customer?.address && (

                  <div className="mt-4">

                    <p className="text-xs text-muted-foreground">
                      العنوان
                    </p>

                    <p className="mt-1 text-sm">
                      {selectedOrder.customer.address}
                    </p>

                  </div>

                )}

              </div>


              {/* Status */}

              <div>

                <p className="mb-2 text-sm font-medium">
                  حالة الطلب
                </p>

                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) =>
                    updateStatus(
                      selectedOrder.id,
                      value
                    )
                  }
                >

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="New">
                      طلب جديد
                    </SelectItem>

                    <SelectItem value="Preparing">
                      قيد التجهيز
                    </SelectItem>

                    <SelectItem value="Completed">
                      مكتمل
                    </SelectItem>

                    <SelectItem value="Cancelled">
                      ملغي
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>


              {/* Products */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="font-semibold">
                    المنتجات
                  </h3>

                  <span className="text-sm text-muted-foreground">
                    {selectedOrder.items?.length || 0} منتجات
                  </span>

                </div>


                <div className="space-y-2">

                  {selectedOrder.items?.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border p-3"
                      >

                        <div className="min-w-0">

                          <p className="truncate font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.quantity} ×{" "}
                            {formatPrice(
                              item.price
                            )}
                          </p>

                        </div>

                        <p className="font-semibold">
                          {formatPrice(
                            item.total
                          )}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* Total */}

              <div className="rounded-2xl bg-primary/5 p-4">

                <div className="flex items-center justify-between">

                  <span className="font-medium">
                    الإجمالي
                  </span>

                  <span className="text-xl font-bold">
                    {formatPrice(
                      selectedOrder.total
                    )}
                  </span>

                </div>

              </div>


              {/* Notes */}

              {selectedOrder.notes && (

                <div>

                  <p className="mb-2 text-sm font-medium">
                    ملاحظات العميل
                  </p>

                  <div className="rounded-xl border bg-muted/30 p-3 text-sm leading-6">
                    {selectedOrder.notes}
                  </div>

                </div>

              )}


              {/* Date */}

              <div className="text-xs text-muted-foreground">

                تاريخ الطلب:

                <span className="ms-1">
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </span>

              </div>


              {/* Delete */}

              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={() => {
                  setDetailsOpen(false);
                  setDeleteOrderData(
                    selectedOrder
                  );
                }}
              >

                <Trash2 className="me-2 size-4" />

                حذف الطلب

              </Button>

            </div>

          ) : null}

        </SheetContent>

      </Sheet>


      {/* ======================================================
          DELETE DIALOG
      ====================================================== */}

      <AlertDialog
        open={!!deleteOrderData}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOrderData(null);
          }
        }}
      >

        <AlertDialogContent
          dir="rtl"
        >

          <AlertDialogHeader>

            <AlertDialogTitle>
              حذف الطلب؟
            </AlertDialogTitle>

            <AlertDialogDescription>

              هل أنت متأكد من حذف الطلب{" "}

              <span className="font-semibold text-foreground">
                #{deleteOrderData?.id}
              </span>

              ؟

              <br />

              لا يمكن التراجع عن هذا الإجراء.

            </AlertDialogDescription>

          </AlertDialogHeader>


          <AlertDialogFooter>

            <AlertDialogCancel
              disabled={deleteLoading}
            >
              إلغاء
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={deleteOrder}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >

              {deleteLoading ? (
                "جاري الحذف..."
              ) : (
                <>
                  <Trash2 className="me-2 size-4" />
                  حذف الطلب
                </>
              )}

            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
}