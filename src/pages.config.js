import CreateOrder from './pages/CreateOrder';
import OrderHistory from './pages/OrderHistory';
import StaffDashboard from './pages/StaffDashboard';
import StaffClients from './pages/StaffClients';
import StaffActiveOrders from './pages/StaffActiveOrders';
import StaffExecutedOrders from './pages/StaffExecutedOrders';
import StaffPayeerAccounts from './pages/StaffPayeerAccounts';


export const PAGES = {
    "CreateOrder": CreateOrder,
    "OrderHistory": OrderHistory,
    "StaffDashboard": StaffDashboard,
    "StaffClients": StaffClients,
    "StaffActiveOrders": StaffActiveOrders,
    "StaffExecutedOrders": StaffExecutedOrders,
    "StaffPayeerAccounts": StaffPayeerAccounts,
}

export const pagesConfig = {
    mainPage: "CreateOrder",
    Pages: PAGES,
};