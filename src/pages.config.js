import CreateOrder from './pages/CreateOrder';
import OrderHistory from './pages/OrderHistory';
import StaffDashboard from './pages/StaffDashboard';
import StaffClients from './pages/StaffClients';
import StaffActiveOrders from './pages/StaffActiveOrders';
import StaffExecutedOrders from './pages/StaffExecutedOrders';
import StaffPayeerAccounts from './pages/StaffPayeerAccounts';
import GTrans from './pages/GTrans';
import GTransContactSales from './pages/GTransContactSales';
import GTransDocumentation from './pages/GTransDocumentation';
import GTransWorkScheme from './pages/GTransWorkScheme';
import GTransFAQ from './pages/GTransFAQ';
import GTransLogin from './pages/GTransLogin';
import GTransPresentation from './pages/GTransPresentation';


export const PAGES = {
    "CreateOrder": CreateOrder,
    "OrderHistory": OrderHistory,
    "StaffDashboard": StaffDashboard,
    "StaffClients": StaffClients,
    "StaffActiveOrders": StaffActiveOrders,
    "StaffExecutedOrders": StaffExecutedOrders,
    "StaffPayeerAccounts": StaffPayeerAccounts,
    "GTrans": GTrans,
    "GTransContactSales": GTransContactSales,
    "GTransDocumentation": GTransDocumentation,
    "GTransWorkScheme": GTransWorkScheme,
    "GTransFAQ": GTransFAQ,
    "GTransLogin": GTransLogin,
    "GTransPresentation": GTransPresentation,
}

export const pagesConfig = {
    mainPage: "CreateOrder",
    Pages: PAGES,
};