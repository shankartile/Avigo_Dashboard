import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoIcon from '@mui/icons-material/Info';

import Card from "../../ui/cards/Card";
import Alert from "../../ui/alert/Alert";
import GraphicalData from "./GraphicalData";

import { RootState, AppDispatch } from "../../../store/store";
import { fetchDashboardSummary } from "../../../store/SocietyAdminDashboard/societyAdminDashboardSlice";

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const { summary, loading } = useSelector(
        (state: RootState) => state.admindashboard
    );

    // cast summary once
    const s = summary as any;

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [alert, setAlert] = useState<{
        type: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    useEffect(() => {
        dispatch(fetchDashboardSummary());
        const t = setTimeout(() => setShowSkeleton(false), 800);
        return () => clearTimeout(t);
    }, [dispatch]);

    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);
            const t = setTimeout(() => {
                setAlert(null);
                navigate(location.pathname, { replace: true });
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [location, navigate]);

    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                    <Skeleton height={22} width="70%" />
                    <Skeleton height={36} width="40%" style={{ marginTop: 8 }} />
                </Box>
            ))}
        </div>
    );

    return (
        <div>
            {alert && (
                <Alert
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    variant="filled"
                    showLink={false}
                    linkHref=""
                    linkText=""
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="p-6">
                <Typography variant="h5" fontWeight={500} mb={2}>
                    Dashboard
                    <Tooltip
                        title="Disply count of all modules,display graph and calculations !"
                        arrow
                        slotProps={{
                            popper: {
                                sx: {
                                    '& .MuiTooltip-tooltip': {
                                        fontSize: '0.8rem',
                                        backgroundColor: '#245492',
                                        color: '#fff',
                                        fontFamily: 'Outfit',
                                        padding: '8px 12px',
                                    },
                                    '& .MuiTooltip-arrow': {
                                        color: '#245492',
                                    },
                                },
                            },
                        }}
                    >
                        <InfoIcon
                            fontSize="medium"
                            sx={{ color: '#245492', cursor: 'pointer' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Tooltip>
                </Typography>

                {showSkeleton || loading ? (
                    renderSkeletons()
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

                        {/* 1. Flats */}
                        <Card
                            title="Total No. Flats"
                            tooltip="Total number of flats count"
                            value={(s?.numberResident || 0) + (s?.numberTenants || 0)}
                            navigateLink="/admin/membermanagement"
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Box display="flex" gap={1} mt={2}>
                                {[
                                    { label: "Resident", color: "#2563eb", count: s?.numberResident || 0 }, // blue
                                    { label: "Tenants", color: "#16a34a", count: s?.numberTenants || 0 }, // green
                                ].map((i) => (
                                    <Box key={i.label} flex={1} p={1} textAlign="center" bgcolor="#f9fafb" borderRadius={2}>
                                        <Typography variant="caption">{i.label}</Typography>
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: i.color }}>
                                            {i.count}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Card>

                        {/* 2. Complaints */}
                        <Card
                            title="Total No. Complaints Raised"
                            tooltip="Total number of complaints raised"
                            value={(s?.numberPending || 0) + (s?.numberSolved || 0)}
                            // navigateLink="/admin/supportticket-management"
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Box display="flex" gap={1} mt={2}>
                                {[
                                    { label: "Pending", color: "#dc2626", count: s?.numberPending || 0 }, // red
                                    { label: "Solved", color: "#22c55e", count: s?.numberSolved || 0 }, // green
                                ].map((i) => (
                                    <Box key={i.label} flex={1} p={1} textAlign="center" bgcolor="#f9fafb" borderRadius={2}>
                                        <Typography variant="caption">{i.label}</Typography>
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: i.color }}>
                                            {i.count}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Card>

                        {/* 3. Maintenance */}
                        <Card
                            title="Total Amount. Maintenance"
                            tooltip="Total amount of Maintenance received this month"
                            value={(s?.numberPaid || 0) + (s?.numberUnpaid || 0)}
                            // navigateLink="/superadmin/society-onboarding"
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Box display="flex" gap={1} mt={2}>
                                {[
                                    { label: "Paid", color: "#0ea5e9", count: s?.numberPaid || 0 }, // sky blue
                                    { label: "Unpaid", color: "#f97316", count: s?.numberUnpaid || 0 }, // orange
                                ].map((i) => (
                                    <Box key={i.label} flex={1} p={1} textAlign="center" bgcolor="#f9fafb" borderRadius={2}>
                                        <Typography variant="caption">{i.label}</Typography>
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: i.color }}>
                                            {i.count}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Card>

                        {/* 4. Expenses */}
                        <Card
                            title="Total No. Expenses"
                            tooltip="Total expenses of this month"
                            value={s?.totalExpenses || 0}
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Typography variant="h5" fontWeight="bold" sx={{ color: "#7c3aed" }}>
                                {s?.totalExpenses || 0}
                            </Typography>
                        </Card>

                        {/* 5. Visitor */}
                        <Card
                            title="Total No. Visitor"
                            tooltip="Total visitor visit today"
                            value={s?.totalVisitor || 0}
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Typography variant="h5" fontWeight="bold" sx={{ color: "#0891b2" }}>
                                {s?.totalVisitor || 0}
                            </Typography>
                        </Card>

                        {/* 6. Tickets */}
                        <Card
                            title="Total No. of Support Tickets Raised"
                            tooltip="Support tickets"
                            value={s?.totalSupportTickets || 0}
                            navigateLink="/admin/supportticket-management"
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Typography variant="h5" fontWeight="bold" sx={{ color: "#be185d" }}>
                                {s?.totalSupportTickets || 0}
                            </Typography>
                        </Card>

                        {/* 7. Notices */}
                        <Card
                            title="Total No. Notices Published"
                            tooltip="Total no of notices published this month."
                            value={(s?.totalNoticesToday || 0) + (s?.totalNoticesMonth || 0)}
                            // navigateLink="/superadmin/society-onboarding"
                            percentage=""
                            isIncrease={false}
                            hideChart
                        >
                            <Box display="flex" gap={1} mt={2}>
                                {[
                                    { label: "Today", color: "#0284c7", count: s?.totalNoticesToday || 0 }, // blue
                                    { label: "This Month", color: "#9333ea", count: s?.totalNoticesMonth || 0 }, // purple
                                ].map((i) => (
                                    <Box key={i.label} flex={1} p={1} textAlign="center" bgcolor="#f9fafb" borderRadius={2}>
                                        <Typography variant="caption">{i.label}</Typography>
                                        <Typography variant="h5" fontWeight="bold" sx={{ color: i.color }}>
                                            {i.count}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Card>

                    </div>
                )}
            </div>

            {/* <GraphicalData /> */}
        </div>
    );
};

export default Dashboard;
