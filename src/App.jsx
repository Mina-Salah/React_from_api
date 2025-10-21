import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  AuthProvider,
  Login,
  Register,
  Profile,
  Dashboard,
  CategoriesList,
  CategoryView,
  CategoryCreate,
  CategoryEdit,
  ProtectedRoute,
  Layout,
} from "./allImports";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoriesList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories/view/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryView />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryCreate />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryEdit />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
