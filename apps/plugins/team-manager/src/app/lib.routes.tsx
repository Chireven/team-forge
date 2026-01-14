import { Route, Routes } from 'react-router-dom';
import { TeamListPage } from './pages/team-list/team-list.page';
import { TeamDetailPage } from './pages/team-detail/team-detail.page';

export function TeamManagerRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TeamListPage />} />
            <Route path="/:id" element={<TeamDetailPage />} />
        </Routes>
    );
}
