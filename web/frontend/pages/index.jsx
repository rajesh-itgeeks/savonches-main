import {
  Page,
  Grid,
  Box,
  Text,
  Button,
  Divider,
  Card,
  BlockStack,
  IndexTable,
  Badge,
  IndexFilters,
  Icon,
  InlineStack,
  ChoiceList,
  TextField,
  useSetIndexFiltersMode,
  useIndexResourceState,
  IndexFiltersMode,
  Pagination,
  Spinner,
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import { ViewIcon, BookIcon, PlusIcon, CashDollarIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
import APIServices from "../services/ApiServices";
import { getStatusTone } from "../components/common/StatusTone";

// Custom debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function QuoteRequestsPage() {
  const APIServ = new APIServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [quoteData, setQuoteData] = useState([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticLoading, setnalyticLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([])
  const pageSize = 5;
  const navigate = useNavigate();

  // Filter states
  const [statusFilter, setStatusFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [shouldFetchCustomDate, setShouldFetchCustomDate] = useState(false);

  // Ref to store the debounced function
  const debouncedFetchQuoteData = useRef(
    debounce((query, status, dateFrom, dateTo, page) => {
      fetchQuoteData(query, status, dateFrom, dateTo, page);
    }, 500)
  ).current;

  // Fetch quote data from API with filters
  const fetchQuoteData = useCallback(async (search = "", status = [], dateFrom, dateTo, page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare filters for API
      const statusArray = status.length > 0 && !status.includes("all") ? status : undefined;
      const searchString = search || undefined;

      const response = await APIServ.getQuoteList({
        limit: pageSize.toString(),
        page: page.toString(),
        status: statusArray,
        search: searchString,
        dateFrom,
        dateTo
      });

      if (response.status && response.result && response.result.list) {
        setQuoteData(response.result.list);
        const totalCount = response.result.pagination?.total || response.result.total || response.result.list.length;
        setTotalQuotes(totalCount);
      } else {
        setError("Failed to fetch quote data: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      setError("Error fetching quote data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // const storeResponse = await APIServ.getStoreData();

        // console.log("---- Store Response ----", storeResponse);


        await fetchQuoteData(searchQuery, statusFilter, undefined, undefined, currentPage);
        const setAnalyticsDatas = await APIServ.getAnalyticsDetails();
        setnalyticLoading(false)
        setAnalyticsData(setAnalyticsDatas.result);

        setIsLoading(false);
        setnalyticLoading(false)
      }
      catch (error) {
        setError("Error fetching store data: " + error.message);
        setIsLoading(false);
        setnalyticLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array for initial fetch

  // Handle filter changes
  useEffect(() => {
    let dateFrom, dateTo;

    if (timeFilter.includes("This Week")) {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      dateFrom = startOfWeek.toISOString().split('T')[0];
      dateTo = endOfWeek.toISOString().split('T')[0];
      debouncedFetchQuoteData(searchQuery, statusFilter, dateFrom, dateTo, currentPage);
    } else if (timeFilter.includes("This Month")) {
      const now = new Date();
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      debouncedFetchQuoteData(searchQuery, statusFilter, dateFrom, dateTo, currentPage);
    } else if (timeFilter.includes("Custom") && shouldFetchCustomDate) {
      if (dateRange.from && dateRange.to) {
        dateFrom = dateRange.from;
        dateTo = dateRange.to;
        debouncedFetchQuoteData(searchQuery, statusFilter, dateFrom, dateTo, currentPage);
        setShouldFetchCustomDate(false);
      }
    } else if (timeFilter.includes("all") || timeFilter.length === 0) {
      // All Time or no time filter selected
      debouncedFetchQuoteData(searchQuery, statusFilter, undefined, undefined, currentPage);
    }
  }, [currentPage, statusFilter, timeFilter, dateRange, searchQuery, debouncedFetchQuoteData, shouldFetchCustomDate]);

  // Focus on search input when typing


  // Index Filters state
  const [itemStrings, setItemStrings] = useState([]);

  const deleteActions = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateActions = (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { },
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
          {
            type: "rename",
            onAction: () => { },
            onPrimaryAction: (value) => {
              const newItemsStrings = tabs.map((item, idx) =>
                idx === index ? value : item.content
              );
              setItemStrings(newItemsStrings);
              return true;
            },
          },
          {
            type: "duplicate",
            onPrimaryAction: duplicateActions,
          },
          {
            type: "edit",
          },
          {
            type: "delete",
            onPrimaryAction: () => {
              deleteActions(index);
              return true;
            },
          },
        ],
  }));

  const [selected, setSelected] = useState(0);
  const onCreateNewActions = (value) => {
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  const sortOptions = [
    { label: "Quote ID", value: "quoteId asc", directionLabel: "Ascending" },
    { label: "Quote ID", value: "quoteId desc", directionLabel: "Descending" },
    { label: "Customer Email", value: "customerEmail asc", directionLabel: "A-Z" },
    { label: "Customer Email", value: "customerEmail desc", directionLabel: "Z-A" },
    { label: "Date", value: "createdAt asc", directionLabel: "Oldest first" },
    { label: "Date", value: "createdAt desc", directionLabel: "Newest first" },
    { label: "Value", value: "totalValue asc", directionLabel: "Low to high" },
    { label: "Value", value: "totalValue desc", directionLabel: "High to low" },
  ];

  const [sortSelected, setSortSelected] = useState(["createdAt desc"]);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const onHandleCancel = () => {
    setSearchQuery('')
  };
  const onHandleSave = () => true;

  const primaryAction =
    selected === 0
      ? {
        type: "save-as",
        onAction: onCreateNewActions,
        disabled: false,
        loading: false,
      }
      : {
        type: "save",
        onAction: onHandleSave,
        disabled: false,
        loading: false,
      };

  const handleStatusChange = useCallback((value) => {
    // If "all" is selected, clear other selections
    const newValue = value.includes("all") ? ["all"] : value.filter(v => v !== "all");
    setStatusFilter(newValue);
    setCurrentPage(1);
  }, []);

  const handleTimeChange = useCallback((value) => {
    // Only allow one time filter to be selected at a time
    const newValue = value.length > 0 ? [value[value.length - 1]] : [];
    setTimeFilter(newValue);
    setCurrentPage(1);

    if (!newValue.includes("Custom")) {
      setDateRange({ from: "", to: "" });
    }
  }, []);

  const handleFiltersQueryChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleStatusRemove = useCallback(() => {
    setStatusFilter([]);
    setCurrentPage(1);
  }, []);

  const handleTimeRemove = useCallback(() => {
    setTimeFilter([]);
    setDateRange({ from: "", to: "" });
    setCurrentPage(1);
  }, []);

  const handleSearchQueryRemove = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    setStatusFilter([]);
    setTimeFilter([]);
    setSearchQuery("");
    setDateRange({ from: "", to: "" });
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((key) => (value) => {
    setDateRange((prev) => ({
      ...prev,
      [key]: value
    }));
    // Only trigger fetch when both dates are selected and "Apply" is clicked
    if (timeFilter.includes("Custom") && key === "to" && value) {
      setShouldFetchCustomDate(true);
    }
  }, [timeFilter]);

  const filters = [
    {
      key: "statusFilter",
      label: "Status",
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { label: "All Status", value: "all" },
            { label: "SUBMITTED", value: "submitted" },
            { label: "QUOTED", value: "quoted" },
            { label: "ACCEPTED", value: "accepted" },
            { label: "REJECTED", value: "rejected" },
            { label: "EXPIRED", value: "expired" },
          ]}
          selected={statusFilter.length === 0 ? [] : statusFilter}
          onChange={handleStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "timeFilter",
      label: "Time",
      filter: (
        <BlockStack gap="400">
          <ChoiceList
            title="Time"
            titleHidden
            choices={[
              { label: "All Time", value: "all" },
              { label: "This Week", value: "This Week" },
              { label: "This Month", value: "This Month" },
              { label: "Custom", value: "Custom" },
            ]}
            selected={timeFilter.length === 0 ? [] : timeFilter}
            onChange={handleTimeChange}
          />
          {timeFilter.includes("Custom") && (
            <BlockStack gap="200">
              <TextField
                label="From"
                type="date"
                value={dateRange.from}
                onChange={handleDateRangeChange("from")}
                autoComplete="off"
              />
              <TextField
                label="To"
                type="date"
                value={dateRange.to}
                onChange={handleDateRangeChange("to")}
                autoComplete="off"
              />
            </BlockStack>
          )}
        </BlockStack>
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];
  if (statusFilter.length > 0) {
    if (!statusFilter.includes("all")) {
      appliedFilters.push({
        key: "statusFilter",
        label: `Status: ${statusFilter.join(", ")}`,
        onRemove: handleStatusRemove,
      });
    }
    appliedFilters.push({
      key: "statusFilter",
      label: `Status: ${statusFilter.join("all ")}`,
      onRemove: handleStatusRemove,
    });

  }

  if (timeFilter.length > 0) {
    let timeLabel = "";
    if (!timeFilter.includes("all")) {

      if (timeFilter.includes("This Week")) {
        timeLabel = "Time: This Week";
      } else if (timeFilter.includes("This Month")) {
        timeLabel = "Time: This Month";
      } else if (timeFilter.includes("Custom")) {
        timeLabel = `Date: ${dateRange.from || 'Start'} to ${dateRange.to || 'End'}`;
      }

    }
    else {
      timeLabel = "Time: All";
    }

    appliedFilters.push({
      key: "timeFilter",
      label: timeLabel,
      onRemove: handleTimeRemove,
    });
  }

  if (searchQuery) {
    appliedFilters.push({
      key: "searchQuery",
      label: `Search: ${searchQuery}`,
      onRemove: handleSearchQueryRemove,
    });
  }

  // Sorting logic
  const sortedData = [...quoteData].sort((a, b) => {
    const [field, direction] = sortSelected[0].split(" ");
    const multiplier = direction === "asc" ? 1 : -1;
    if (field === "quoteId") return multiplier * (a.quoteId || "").localeCompare(b.quoteId || "");
    if (field === "customerEmail") return multiplier * (a.customerEmail || "").localeCompare(b.customerEmail || "");
    if (field === "createdAt") return multiplier * (new Date(a.createdAt) - new Date(b.createdAt));
    if (field === "totalValue") return multiplier * (parseFloat(a.quotedOffer || 0) - parseFloat(b.quotedOffer || 0));
    return 0;
  });

  const totalPages = Math.ceil(totalQuotes / pageSize);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(sortedData);

  const rowMarkup = sortedData.map((quote, index) => {
    const { _id, quoteId, customerEmail, quotedOffer, quoteStatus, createdAt } = quote;
    const formattedDate = new Date(createdAt).toLocaleDateString();

    return (
      <IndexTable.Row
        id={_id}
        key={_id}
        position={index}
        selected={selectedResources.includes(_id)}
      >
        <IndexTable.Cell>{quoteId}</IndexTable.Cell>
        <IndexTable.Cell>{customerEmail}</IndexTable.Cell>
        <IndexTable.Cell>${quotedOffer?.toFixed(2)}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={getStatusTone(quoteStatus) || "default"}>{quoteStatus}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{formattedDate}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            icon={ViewIcon}
            plain
            onClick={() => navigate(`/QuoteDetail/${_id}`)}
            accessibilityLabel={`View details for quote ${quoteId}`}
            variant="monochromePlain"
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Page fullWidth title="Quote Requests" subtitle="Manage and track all customer quote requests">
      <Divider borderWidth="050" borderColor="border" />
      <Box paddingBlockStart="400">
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
            <Card>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h6">
                    Total Quotes
                  </Text>
                  <Text variant="bodyLg" fontWeight="semibold">
                    {analyticLoading ? <Spinner size="small" /> : analyticsData?.totalValue}
                  </Text>
                </BlockStack>
                <div
                  style={{
                    backgroundColor: "#f6f6f7",
                    padding: "0.25rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "scale(1.4)",
                    height: "30px",
                  }}
                >
                  <Icon source={BookIcon} tone="base" />
                </div>
              </InlineStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
            <Card>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h6">
                    New Requests
                  </Text>
                  <Text variant="bodyLg" fontWeight="semibold">
                    {analyticLoading ? <Spinner size="small" /> : analyticsData?.newRequestCount}
                  </Text>
                </BlockStack>
                <div
                  style={{
                    backgroundColor: "#f6f6f7",
                    padding: "0.25rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "scale(1.4)",
                    height: "30px",
                  }}
                >
                  <Icon source={PlusIcon} tone="base" />
                </div>
              </InlineStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
            <Card>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h6">
                    Accepted
                  </Text>
                  <Text variant="bodyLg" fontWeight="semibold">

                    {analyticLoading ? <Spinner size="small" /> : analyticsData?.totalQuotationCount}

                  </Text>
                </BlockStack>
                <div
                  style={{
                    backgroundColor: "#f6f6f7",
                    padding: "0.25rem",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "scale(1.4)",
                    height: "30px",
                  }}
                >
                  <Icon source={CashDollarIcon} tone="base" />
                </div>
              </InlineStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </Box>

      <Box paddingBlockStart="600">
        <Card padding="0">
          <IndexFilters
            // mode="filtering"
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue={searchQuery}
            queryPlaceholder="Search quotes by ID, email or status"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleSearchQueryRemove}
            onSort={setSortSelected}
            // primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
              content: 'Clear'
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            // canCreateNewView
            // onCreateNewView={onCreateNewActions}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            // setMode={setMode}
            // disabled={isLoading}
            autoFocusSearchField={false}
          />
          {isLoading ? (
            <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10rem" }}>
              <Spinner accessibilityLabel="Loading quote data" size="large" />
            </Box>
          ) : error ? (
            <Box paddingBlock="600">
              <Text variant="bodyMd" color="critical">
                {error}
              </Text>
            </Box>
          ) : (
            <>
              <IndexTable
                resourceName={{ singular: "quote", plural: "quotes" }}
                itemCount={quoteData.length}
                selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "Quote ID" },
                  { title: "Customer Email" },
                  { title: "Total Value" },
                  { title: "Status" },
                  { title: "Date" },
                  { title: "Actions" },
                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
              {totalPages > 1 && (
                <div style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "10px",
                  marginTop: "16px",
                  borderTop: "1px solid #dfe3e8",
                  backgroundColor: "#f7f7f7"
                }}>
                  <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage((prev) => prev - 1)}
                    hasNext={currentPage < totalPages}
                    onNext={() => setCurrentPage((prev) => prev + 1)}
                    label={`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalQuotes)} of ${totalQuotes}`}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </Box>
    </Page>
  );
}