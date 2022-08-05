import React, { useReducer } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ControlPage from "../components/ControlPage";
import SampleReportPage from "../components/SampleReportPage";
import ImportPage from "../components/ImportPage";
import HelpPage from "../components/HelpPage";
import NotFoundPage from "../components/NotFoundPage";
import Layout from "../components/Layout";
import NegativeControlContext from "../context/NegativeControlContext";
import NegativeControlReducer from "../reducers/NegativeControlReducer";
import SampleReducer from "../reducers/SampleReducer";
import SampleContext from "../context/SampleContext";

const AppRouter = () => {
  const [negativeControl, dispatch] = useReducer(NegativeControlReducer, []);
  const [samples, sampleDispatch] = useReducer(SampleReducer, []);
  return (
    <BrowserRouter>
      <Layout>
        <NegativeControlContext.Provider value={{ negativeControl, dispatch }}>
          <SampleContext.Provider value={{ samples, sampleDispatch }}>
            <Routes>
              <Route path="/" element={<ImportPage />} />
              <Route path="control" element={<ControlPage />} />
              <Route path="report" element={<SampleReportPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </SampleContext.Provider>
        </NegativeControlContext.Provider>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;
