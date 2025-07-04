import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Header02 from "../header02";
import Footer from "../footer";
import SearchComponent from "./search_component";
import TrainSearchResultList from "./train_search-result";

const TrainList01 = () => {
  const location = useLocation();
  const searchParams = location.state || JSON.parse(localStorage.getItem("searchParams") || '{}');

  const [filters, setFilters] = useState({
    ac: false,
    available: false,
    
    departureEarlyMorning: false,
    departureMorning: false,
    departureMidDay: false,
    departureNight: false,
    
    arrivalEarlyMorning: false,
    arrivalMorning: false,
    arrivalMidDay: false,
    arrivalNight: false,
    
    freeCancellation: false,
    tripGuarantee: false,
    
    "1A": false,
    "2A": false,
    "3A": false,
    "3E": false,
    SL: false,
    
    quota: "GN" // Default to General quota
  });

  const onFilterChange = useCallback((e) => {
    const { id, checked, type } = e.target;
    
    setFilters((prevFilters) => {
      if (type === "radio") {
        return {
          ...prevFilters,
          quota: id,
        };
      } else if (type === "checkbox") {

        if (id === "available") {
          return {
            ...prevFilters,
            available: checked,
          };
        }

        if (id === "ac") {
          // When AC is checked/unchecked, update all AC class filters
          return {
            ...prevFilters,
            ac: checked,
            "1A": checked,
            "2A": checked,
            "3A": checked,
            "3E": checked
          };
        }
        // For AC classes, also update the main AC filter if needed
        if (["1A", "2A", "3A", "3E"].includes(id)) {
          
          const updatedFilters = {
            ...prevFilters,
            [id]: checked
          };




          // Check if all AC classes are selected/deselected
           const allACClassesSelected = ["1A", "2A", "3A", "3E"].every(
            cls => cls === id? checked :updatedFilters[cls]);
            const anyACClassSelected = ["1A", "2A", "3A", "3E"].some(cls => cls === id ? checked :  !updatedFilters[cls]);
          
          return {
            ...updatedFilters,
            ac: allACClassesSelected
          };
        }
        return {
          ...prevFilters,
          [id]: checked,
        };
      }
      return prevFilters;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({
      ac: false,
      available: false,
      
      departureEarlyMorning: false,
      departureMorning: false,
      departureMidDay: false,
      departureNight: false,
      
      arrivalEarlyMorning: false,
      arrivalMorning: false,
      arrivalMidDay: false,
      arrivalNight: false,
      
      freeCancellation: false,
      tripGuarantee: false,
      
      "1A": false,
      "2A": false,
      "3A": false,
      "3E": false,
      SL: false,
      
      quota: "GN" // Maintain General quota as default
    });
  }, []);

  return (
    <div>
      <div id="preloader">
        <div className="preloader">
          <span />
          <span />
        </div>
      </div>
      <div id="main-wrapper">
        <Header02 />
        <div className="clearfix" />
        <SearchComponent
          backgroundColor="#cd2c22"
          height="130px"
          leavingLabel={null}
          goingLabel={null}
          dateLabel={null}
          buttonBackgroundColor="#cd2c22"
          buttonTextColor="#ffffff"
          dropdownHindden='none'
          checklabelColor='#ffffff'
          highlightsContainer='none'
          authorizedContainer='none'
          initialValues={searchParams}
          customStyles={{
            swapIcon: `
              .swap-icon-container {
                display: flex;
                position: absolute;
                top: 18% !important;
                left: 34.7% !important;
                transform: translateY(-50%);
                z-index: 2;
                // background: white;
                border-radius: 50%;
                padding: 8px;
                // box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
              }
              
              .swap-button {
                background: none;
                border: none;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .swap-button i {
                color: #17181c;
                font-size: 16px;
              }

              @media (max-width: 768px) {
                .swap-icon-container {
                  left: 46% !important;
                }
              }

              @media (max-width: 576px) {
                .swap-icon-container {
                  left: 44% !important;
                }
              }
            `
          }}
        />
        <section className="gray-simple">
          <div className="container">
            <div className="row justify-content-between gy-4 gx-xl-4 gx-lg-3 gx-md-3 gx-4">
              {/* Desktop Filter Sidebar */}
              <div className="col-xl-3 col-lg-4 col-md-12 d-none d-lg-block">
                <div className="filter-searchBar bg-white rounded-3" style={{ boxShadow:"0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                  <div className="filter-searchBar-head border-bottom">
                    <div className="searchBar-headerBody d-flex align-items-start justify-content-between px-3 py-3">
                      <div className="searchBar-headerfirst">
                        <h6 className="fw-bold fs-5 m-0">Filters</h6>
                      </div>
                      <div className="searchBar-headerlast text-end">
                        <Link
                          to="#"
                          className="text-md fw-medium text-primary active"
                          onClick={handleClearAll}
                        >
                          Clear All
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="filter-searchBar-body">
                    {/* Quick Filters */}
                    <div className="searchBar-single px-3 py-3 border-bottom">
                      <div className="searchBar-single-title d-flex mb-3">
                        <h6 className="sidebar-subTitle fs-6 fw-medium m-0">
                          Quick Filters
                        </h6>
                      </div>
                      <div className="searchBar-single-wrap">
                        <ul className="row align-items-center justify-content-between p-0 gx-3 gy-2">
                          <li className="col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="ac"
                                checked={filters.ac}
                                onChange={onFilterChange}
                              />
                              <label className="form-check-label" htmlFor="ac">
                                AC
                              </label>
                            </div>
                          </li>
                          <li className="col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="available"
                                checked={filters.available}
                                onChange={onFilterChange}
                              />
                              <label className="form-check-label" htmlFor="available">
                                Available
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="searchBar-single px-3 py-3 border-bottom">
                      {/* Quota */}
                      <div className="searchBar-single-title d-flex mb-1 mt-3">
                        <h6 className="sidebar-subTitle fs-6 fw-medium m-0">
                          Quota
                        </h6>
                      </div>
                      <ul className="row align-items-center justify-content-between p-0 gx-3 gy-2">
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="quota"
                              id="GN"
                              checked={filters.quota === "GN"}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="GN">
                              General
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="quota"
                              id="TQ"
                              checked={filters.quota === "TQ"}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="TQ">
                              Tatkal
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="quota"
                              id="PT"
                              checked={filters.quota === "PT"}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="PT">
                              Premium Tatkal
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="quota"
                              id="LD"
                              checked={filters.quota === "LD"}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="LD">
                              Ladies
                            </label>
                          </div>
                        </li>
                      </ul>
                      
                      {/* Journey Class */}
                      <div className="searchBar-single-title d-flex mb-1 mt-3">
                        <h6 className="sidebar-subTitle fs-6 fw-medium m-0">
                          Journey Class
                        </h6>
                      </div>
                      <ul className="row align-items-center justify-content-between p-0 gx-3 gy-2">
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="1A"
                              checked={filters["1A"]}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="1A">
                              1A (First Class AC)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="2A"
                              checked={filters["2A"]}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="2A">
                              2A (Second Class AC)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="3A"
                              checked={filters["3A"]}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="3A">
                              3A (Third Class AC)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="3E"
                              checked={filters["3E"]}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="3E">
                              3E (AC 3 tier Economy)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="SL"
                              checked={filters.SL}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="SL">
                              SL (Sleeper Class)
                            </label>
                          </div>
                        </li>
                      </ul>

                      {/* Departure Time Filters */}
                      <div className="searchBar-single-title d-flex mb-1 mt-3">
                        <h6 className="sidebar-subTitle fs-6 fw-medium m-0">
                          Departure Time
                        </h6>
                      </div>
                      <ul className="row align-items-center justify-content-between p-0 gx-3 gy-2">
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="departureEarlyMorning"
                              checked={filters.departureEarlyMorning}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="departureEarlyMorning">
                              Early Morning (00:00 - 06:00)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="departureMorning"
                              checked={filters.departureMorning}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="departureMorning">
                              Morning (06:00 - 12:00)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="departureMidDay"
                              checked={filters.departureMidDay}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="departureMidDay">
                              Mid Day (12:00 - 18:00)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="departureNight"
                              checked={filters.departureNight}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="departureNight">
                              Night (18:00 - 24:00)
                            </label>
                          </div>
                        </li>
                      </ul>

                      {/* Arrival Time Filters */}
                      <div className="searchBar-single-title d-flex mb-1 mt-3">
                        <h6 className="sidebar-subTitle fs-6 fw-medium m-0">
                          Arrival Time
                        </h6>
                      </div>
                      <ul className="row align-items-center justify-content-between p-0 gx-3 gy-2">
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="arrivalEarlyMorning"
                              checked={filters.arrivalEarlyMorning}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="arrivalEarlyMorning">
                              Early Morning (00:00 - 06:00)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="arrivalMorning"
                              checked={filters.arrivalMorning}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="arrivalMorning">
                              Morning (06:00 - 12:00)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="arrivalMidDay"
                              checked={filters.arrivalMidDay}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="arrivalMidDay">
                              Mid Day (12:00 - 18:00)
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="arrivalNight"
                              checked={filters.arrivalNight}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="arrivalNight">
                              Night (18:00 - 24:00)
                            </label>
                          </div>
                        </li>
                      </ul>

                      {/* Other Filters */}
                      <div className="searchBar-single-title d-flex mb-1 mt-3">
                        <h6 className="sidebar-subTitle fs-6 fw-medium m-0">
                          Other Filters
                        </h6>
                      </div>
                      <ul className="row align-items-center justify-content-between p-0 gx-3 gy-2">
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="freeCancellation"
                              checked={filters.freeCancellation}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="freeCancellation">
                              Free Cancellation
                            </label>
                          </div>
                        </li>
                        <li className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="tripGuarantee"
                              checked={filters.tripGuarantee}
                              onChange={onFilterChange}
                            />
                            <label className="form-check-label" htmlFor="tripGuarantee">
                              Trip Guarantee
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Train List and Mobile Filter/Sort */}
              <div className="col-xl-9 col-lg-8 col-md-12">
                {/* Mobile Filter/Sort Buttons */}
                <div className="d-lg-none mb-3">
                  {/* The actual buttons will be rendered by TrainSearchResultList */}
                </div>
                <TrainSearchResultList
                  filters={filters}
                  setFilters={setFilters}
                  onFilterChange={onFilterChange}
                  handleClearAll={handleClearAll}
                />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(TrainList01);