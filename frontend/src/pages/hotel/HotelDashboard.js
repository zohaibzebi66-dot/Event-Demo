import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelService } from "../../services/hotelApi";
import { eventService } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const HotelDashboard = () => {
  const [hotel, setHotel] = useState(null);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    description: "",
  });
  const [packageForm, setPackageForm] = useState({
    eventId: "",
    packageName: "",
    details: "",
    price: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const currentHotel = hotelService.getCurrentHotel();
    if (!currentHotel || !hotelService.isAuthenticated()) {
      navigate("/hotel/login");
      return;
    }

    setHotel(currentHotel);
    loadData(currentHotel.id);
  }, [navigate]);

  const loadData = async (hotelId) => {
    try {
      setLoading(true);

      // Load events, services, and packages in parallel
      const [eventsRes, servicesRes, packagesRes] = await Promise.all([
        eventService.getAllEvents(),
        hotelService.getServices(hotelId),
        hotelService.getPackages(hotelId),
      ]);

      setEvents(eventsRes.data || []);
      setServices(servicesRes.data || []);
      setPackages(packagesRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    hotelService.logout();
    navigate("/hotel/login");
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await hotelService.addService(hotel.id, serviceForm);
      setSuccess("Service added successfully!");
      setServiceForm({ serviceName: "", description: "" });
      setShowServiceForm(false);
      await loadData(hotel.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await hotelService.createPackage(hotel.id, packageForm);
      setSuccess("Package created successfully!");
      setPackageForm({ eventId: "", packageName: "", details: "", price: "" });
      setShowPackageForm(false);
      await loadData(hotel.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !hotel) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hotel Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {hotel?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            <p className="text-3xl font-bold text-primary-600">
              {services.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Packages</h3>
            <p className="text-3xl font-bold text-primary-600">
              {packages.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Events
            </h3>
            <p className="text-3xl font-bold text-primary-600">
              {events.length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Services
                </h2>
                <button
                  onClick={() => setShowServiceForm(!showServiceForm)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {showServiceForm ? "Cancel" : "Add Service"}
                </button>
              </div>
            </div>

            {/* Add Service Form */}
            {showServiceForm && (
              <div className="p-6 border-b bg-gray-50">
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceForm.serviceName}
                      onChange={(e) =>
                        setServiceForm((prev) => ({
                          ...prev,
                          serviceName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Banquet Hall"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={serviceForm.description}
                      onChange={(e) =>
                        setServiceForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your service..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Service"}
                  </button>
                </form>
              </div>
            )}

            {/* Services List */}
            <div className="p-6">
              {services.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No services added yet
                </p>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {service.serviceName}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {service.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Added:{" "}
                        {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Packages Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Event Packages
                </h2>
                <button
                  onClick={() => setShowPackageForm(!showPackageForm)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {showPackageForm ? "Cancel" : "Create Package"}
                </button>
              </div>
            </div>

            {/* Add Package Form */}
            {showPackageForm && (
              <div className="p-6 border-b bg-gray-50">
                <form onSubmit={handlePackageSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Event
                    </label>
                    <select
                      required
                      value={packageForm.eventId}
                      onChange={(e) =>
                        setPackageForm((prev) => ({
                          ...prev,
                          eventId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Choose an event...</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title} - {event.date}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Name
                    </label>
                    <input
                      type="text"
                      required
                      value={packageForm.packageName}
                      onChange={(e) =>
                        setPackageForm((prev) => ({
                          ...prev,
                          packageName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Premium Package"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={packageForm.details}
                      onChange={(e) =>
                        setPackageForm((prev) => ({
                          ...prev,
                          details: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe what's included..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={packageForm.price}
                      onChange={(e) =>
                        setPackageForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Package"}
                  </button>
                </form>
              </div>
            )}

            {/* Packages List */}
            <div className="p-6">
              {packages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No packages created yet
                </p>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {pkg.packageName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {pkg.details}
                          </p>
                          {pkg.event && (
                            <p className="text-sm text-primary-600 mt-2">
                              Event: {pkg.event.title} ({pkg.event.date})
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Created:{" "}
                            {new Date(pkg.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${pkg.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;
