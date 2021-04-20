import { createRouter,createWebHashHistory} from 'vue-router';
import Dashboard from './views/Dashboard.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/schedule',
        component: () => import('./views/Schedule.vue'),
        children: [
            {
                path: '',
                name: 'weeklysched',
                component: () => import('./views/WeeklySchedule.vue'),
            },
            {
                path: '/schedule/addappointment',
                component: () => import('./views/AddAppointment.vue'),
            },
        ],
    },
    {
        path: '/student',
        component: () => import('./views/StudentMgmt.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/StudentList.vue'),
            },
            {
                path: '/student/add',
                component: () => import('./views/AddStudent.vue'),
            },
            {
                path: '/student/family',
                component: () => import('./views/FamilyGroups.vue'),
            },
        ],
    },
    {
        path: '/tutor',
        component: () => import('./views/TutorMgmt.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/TutorList.vue'),
            },
            {
                path: '/tutor/add',
                component: () => import('./views/AddTutor.vue'),
            },
        ],
    },
    {
        path: '/statements',
        name: 'statements',
        component: () => import('./views/Invoices.vue'),
    },
    {
        path: '/formlayout',
        name: 'formlayout',
        component: () => import('./components/FormLayoutDemo.vue'),
    },
    {
        path: '/input',
        name: 'input',
        component: () => import('./components/InputDemo.vue'),
    },
    {
        path: '/floatlabel',
        name: 'floatlabel',
        component: () => import('./components/FloatLabelDemo.vue'),
    },
    {
        path: '/button',
        name: 'button',
        component: () => import('./components/ButtonDemo.vue'),
    },
    {
        path: '/table',
        name: 'table',
        component: () => import('./components/TableDemo.vue'),
    },
    {
        path: '/list',
        name: 'list',
        component: () => import('./components/ListDemo.vue'),
    },
    {
        path: '/tree',
        name: 'tree',
        component: () => import('./components/TreeDemo.vue'),
    },
    {
        path: '/panel',
        name: 'panel',
        component: () => import('./components/PanelsDemo.vue'),
    },
    {
        path: '/overlay',
        name: 'overlay',
        component: () => import('./components/OverlayDemo.vue'),
    },
    {
        path: '/menu',
        component: () => import('./components/MenuDemo.vue'),
        children: [
            {
                path: '',
                component: () => import('./components/menu/PersonalDemo.vue'),
            },
            {
                path: '/menu/seat',
                component: () => import('./components/menu/SeatDemo.vue'),
            },
            {
                path: '/menu/payment',
                component: () => import('./components/menu/PaymentDemo.vue'),
            },
            {
                path: '/menu/confirmation',
                component: () => import('./components/menu/ConfirmationDemo.vue'),
            },
        ],
    },
    {
        path: '/messages',
        name: 'messages',
        component: () => import('./components/MessagesDemo.vue'),
    },
    {
        path: '/file',
        name: 'file',
        component: () => import('./components/FileDemo.vue'),
    },
    {
        path: '/chart',
        name: 'chart',
        component: () => import('./components/ChartDemo.vue'),
    },
    {
        path: '/misc',
        name: 'misc',
        component: () => import('./components/MiscDemo.vue'),
    },
    {
        path: '/display',
        name: 'display',
        component: () => import('./utilities/DisplayDemo.vue'),
    },
    {
        path: '/flexbox',
        name: 'flexbox',
        component: () => import('./utilities/FlexBoxDemo.vue'),
    },
    {
        path: '/text',
        name: 'text',
        component: () => import('./utilities/TextDemo.vue'),
    },
    {
        path: '/icons',
        name: 'icons',
        component: () => import('./utilities/Icons.vue'),
    },
    {
        path: '/grid',
        name: 'grid',
        component: () => import('./utilities/GridDemo.vue'),
    },
    {
        path: '/spacing',
        name: 'spacing',
        component: () => import('./utilities/SpacingDemo.vue'),
    },
    {
        path: '/elevation',
        name: 'elevation',
        component: () => import('./utilities/ElevationDemo.vue'),
    },
    {
        path: '/typography',
        name: 'typography',
        component: () => import('./utilities/Typography.vue'),
    },
    {
        path: '/crud',
        name: 'crud',
        component: () => import('./pages/CrudDemo.vue'),
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import('./pages/CalendarDemo.vue'),
    },
    {
        path: '/empty',
        name: 'empty',
        component: () => import('./components/EmptyPage.vue'),
    },
    {
        path: '/documentation',
        name: 'documentation',
        component: () => import('./components/Documentation.vue'),
    },
];

// console.log(process.env.BASE_URL)
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    mode: 'history',
});

export default router;
