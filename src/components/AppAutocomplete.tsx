import React, { useEffect } from "react";
import PageHeader from "./PageHeader";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Helmet } from "react-helmet-async";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { setHours, setMinutes, subDays } from "date-fns";
import useRefMounted from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  styled,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  InputAdornment,
  Tooltip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/lab";
import { ChangeEvent, useState } from "react";
import {
  GenderStatus,
  OwnerStatus,
  PatientAgeStatus,
} from "src/models/project";
import Scrollbar from "src/components/Scrollbar";
import ArrowForwardTwoToneIcon from "@mui/icons-material/ArrowForwardTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ArrowBack from "@mui/icons-material/ArrowBack";

const assignees = [
  {
    name: "Self",
    qulification: "",
  },
  {
    name: "Jhon Doe",
    qulification: "MBBS, MDH, MS",
  },
  {
    name: "Vishal Hanumante",
    qulification: "MBBS, MDH, MS",
  },
  {
    name: "Zain Vetrovs",
    qulification: "BHMS, Path",
  },
  {
    name: "Wasim Haq",
    qulification: "BHMS, Homipathy",
  },
  {
    name: "Ajanta Hospital",
    qulification: "BHMS, Homipathy",
  },
  {
    name: "AAI Hospital",
    qulification: "BHMS, Homipathy",
  },
];

const FilterOptions = styled(Card)(
  ({ theme }) => `
      padding: ${theme.spacing(2)};
      border: 1px solid ${theme.colors.alpha.black[10]};
  `
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    border-radius: 100px;
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};

    .MuiSvgIcon-root {
        transform-origin: center;
        transform: scale(1);
        transition: ${theme.transitions.create(["transform"])};
    }

    &:hover {
        .MuiSvgIcon-root {
            transform: scale(1.4);
        }
    }
  `
);

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
      .MuiInputBase-input {
          font-size: ${theme.typography.pxToRem(17)};
      }
`
);

const getInitialValues = (event?: Event) => {
  if (event) {
    return _.merge(
      {},
      {
        drReference: "",
        end: setHours(setMinutes(subDays(new Date(), 3), 30), 10),
        start: setHours(setMinutes(subDays(new Date(), 3), 60), 8),
        submit: null,
        owner: "",
        patientName: "",
        age: "",
      },
      event
    );
  }

  return {
    drReference: "",
    end: setHours(setMinutes(subDays(new Date(), 1), 35), 20),
    start: setHours(setMinutes(subDays(new Date(), 1), 25), 17),
    title: "",
    submit: null,
    owner: "",
    patientName: "",
    age: "",
  };
};

const statusOptions = [
  {
    id: "year",
    name: "Year",
  },
  {
    id: "month",
    name: "Month",
  },
  {
    id: "day",
    name: "Day",
  },
];

const ownerOptions = [
  {
    id: "mr",
    name: "Mr",
  },
  {
    id: "mrs",
    name: "Mrs",
  },
  {
    id: "miss",
    name: "Miss",
  },
  {
    id: "shree",
    name: "Shree",
  },
  {
    id: "baby",
    name: "Baby",
  },
];

const genderOptions = [
  {
    id: "male",
    name: "Male",
  },
  {
    id: "female",
    name: "Female",
  },
  {
    id: "child_male",
    name: "Child Male",
  },
  {
    id: "child_female",
    name: "Child Female",
  },
  {
    id: "other",
    name: "Other",
  },
];

interface TestOption {
  id: number;
  testName: string;
  price: number;
}

// interface TestItem {
//   id: number;
//   testName: string;
//   price: number;
// }

const testOption: TestOption[] = [
  {
    id: 1,
    testName: "hemogram CBC",
    price: 150,
  },
  {
    id: 2,
    testName: "blood group",
    price: 50,
  },
  {
    id: 3,
    testName: "widal",
    price: 150,
  },
  {
    id: 4,
    testName: "HB TC DC",
    price: 300,
  },
  {
    id: 5,
    testName: "mp (Malaria Parasites)",
    price: 500,
  },
  {
    id: 6,
    testName: "ESR",
    price: 250,
  },
  {
    id: 7,
    testName: "Bio chemistry Report Full",
    price: 250,
  },
  {
    id: 8,
    testName: "Urine Analysis",
    price: 250,
  },
  {
    id: 9,
    testName: "TFT",
    price: 250,
  },
  {
    id: 10,
    testName: "uric acid",
    price: 250,
  },
  {
    id: 11,
    testName: "Calcium",
    price: 100,
  },
];

const applySearchTest = (tests: TestOption[], query: string): TestOption[] => {
  return tests.filter(({ testName }) => {
    let matches = true;

    if (query) {
      let containsQuery = false;
      if (testName.toLowerCase().includes(query.toLowerCase())) {
        containsQuery = true;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

function DashboardReports() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [query, setQuery] = useState<string>("");

  const searchTest = applySearchTest(testOption, query);

  const [filters, setFilters] = useState({
    status: null,
    owner: null,
    gender: null,
  });
  const [selectedTests, setSelectedTests] = useState([]);

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== "year") {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== "mr") {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      owner: value,
    }));
  };

  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== "male") {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      gender: value,
    }));
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  // Load selected items from local storage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem("selectedTests");
    if (storedItems) {
      setSelectedTests(JSON.parse(storedItems));
    }
  }, []);

  // Update local storage whenever selectedItems changes
  useEffect(() => {
    localStorage.setItem("selectedTests", JSON.stringify(selectedTests));
  }, [selectedTests]);

  const handleSelectTest = (selectedTest) => {
    const isExisting = selectedTests.some(
      (item) => item.id === selectedTest.id
    );

    if (!isExisting) {
      setSelectedTests([...selectedTests, selectedTest]);
    } else {
      enqueueSnackbar(t("Test  already selected!"), {
        variant: "error",
      });
    }
  };

  const handleRemoveSelectTest = (id: number | string) => {
    const updateSelectedTests = selectedTests.filter((item) => item.id !== id);
    setSelectedTests(updateSelectedTests);
  };

  return (
    <>
      <Helmet>
        <title>Reports Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Formik
            initialValues={getInitialValues(event)}
            validationSchema={Yup.object().shape({
              drReference: Yup.string(),
              patientName: Yup.string()
                .max(255)
                .required(t("Patient name is Required")),
              age: Yup.string().required(t("Please enter age")),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ): Promise<void> => {
              try {
                console.log("values", values);

                if (isMountedRef.current) {
                  setStatus({ success: true });
                  setSubmitting(false);
                }
              } catch (err) {
                if (isMountedRef.current) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue,
            }): JSX.Element => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid
                  sx={{ px: 4 }}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={4}
                >
                  <Grid item xs={12}>
                    <FilterOptions>
                      <Grid
                        container
                        direction="row"
                        // justifyContent="center"
                        alignItems="stretch"
                        spacing={3}
                      >
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            id="disable-clearable"
                            disableClearable
                            fullWidth
                            limitTags={2}
                            // @ts-ignore
                            getOptionLabel={(option) => option.name}
                            options={assignees}
                            renderOption={(props, option) => (
                              <li {...props}>{option.name}</li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                label={t("Dr. Reference")}
                                placeholder={t("Select Doctor")}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DateTimePicker
                            value={new Date()}
                            onChange={(date) => setFieldValue("end", date)}
                            label={t("Date")}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                fullWidth
                                name="end"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("Owhner")}</InputLabel>
                            <Select
                              value={filters.owner || "mr"}
                              onChange={handleOwnerChange}
                              label={t("Owhner")}
                            >
                              {ownerOptions.map((statusOption) => (
                                <MenuItem
                                  key={statusOption.id}
                                  value={statusOption.id}
                                >
                                  {statusOption.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={Boolean(
                              touched.patientName && errors.patientName
                            )}
                            fullWidth
                            helperText={
                              touched.patientName && errors.patientName
                            }
                            label={t("Patient Name")}
                            name="patientName"
                            // margin="normal"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.patientName}
                            variant="outlined"
                            autoComplete="off"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <TextField
                            error={Boolean(touched.age && errors.age)}
                            fullWidth
                            helperText={touched.age && errors.age}
                            label={t("Age")}
                            name="age"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.age}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("Status")}</InputLabel>
                            <Select
                              value={filters.status || "year"}
                              onChange={handleStatusChange}
                              label={t("Status")}
                            >
                              {statusOptions.map((statusOption) => (
                                <MenuItem
                                  key={statusOption.id}
                                  value={statusOption.id}
                                >
                                  {statusOption.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("Gender")}</InputLabel>
                            <Select
                              value={filters.gender || "male"}
                              onChange={handleGenderChange}
                              label={t("Gender")}
                            >
                              {genderOptions.map((statusOption) => (
                                <MenuItem
                                  key={statusOption.id}
                                  value={statusOption.id}
                                >
                                  {t(statusOption.name)}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                border: "1px solid #C7CCD4",
                                borderRadius: "16px",
                                height: 600,
                              }}
                            >
                              <Box
                                p={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <SearchInputWrapper
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <SearchTwoToneIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                  placeholder={t("Search Test")}
                                  fullWidth
                                  onChange={handleQueryChange}
                                  value={query}
                                />
                              </Box>
                              <Divider />
                              <Box height={500}>
                                {searchTest.length === 0 ? (
                                  <>
                                    <Typography
                                      sx={{
                                        py: 10,
                                      }}
                                      variant="h3"
                                      fontWeight="normal"
                                      color="text.secondary"
                                      align="center"
                                    >
                                      {t(
                                        "We couldn't find any test matching your search criteria"
                                      )}
                                    </Typography>
                                  </>
                                ) : (
                                  <Scrollbar>
                                    <List disablePadding>
                                      {searchTest.map(
                                        ({ testName, ...val }, index) => (
                                          <React.Fragment key={val.id}>
                                            <ListItem
                                              sx={{
                                                px: 2,
                                                py: 0,
                                                cursor: "pointer",
                                                "&:hover": {
                                                  background: `${theme.colors.alpha.black[10]}`,
                                                },
                                              }}
                                              onClick={() =>
                                                handleSelectTest({
                                                  testName,
                                                  ...val,
                                                })
                                              }
                                            >
                                              <ListItemText
                                                primary={
                                                  <Typography
                                                    gutterBottom
                                                    variant="h4"
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      textTransform:
                                                        "uppercase",
                                                    }}
                                                  >
                                                    {t(testName)}
                                                  </Typography>
                                                }
                                              />
                                              <Tooltip
                                                title={t(`Add ${testName}`)}
                                                arrow
                                                placement="right"
                                                sx={{
                                                  textTransform: "uppercase",
                                                }}
                                              >
                                                <IconButtonWrapper color="primary">
                                                  <ArrowForwardTwoToneIcon fontSize="small" />
                                                </IconButtonWrapper>
                                              </Tooltip>
                                            </ListItem>
                                            {index !==
                                              testOption.length - 1 && (
                                              <Divider />
                                            )}
                                          </React.Fragment>
                                        )
                                      )}
                                    </List>
                                  </Scrollbar>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                height: 600,
                              }}
                            >
                              <Box
                                sx={{
                                  border: "1px solid #C7CCD4",
                                  borderRadius: "16px",
                                }}
                                height="100%"
                              >
                                <Scrollbar>
                                  <List disablePadding>
                                    {selectedTests.length === 0 ? (
                                      <Typography
                                        sx={{ pt: 20, pb: 10 }}
                                        variant="h3"
                                        fontWeight="normal"
                                        color="text.secondary"
                                        align="center"
                                      >
                                        {t(
                                          "We couldn't find any Selected Test"
                                        )}
                                      </Typography>
                                    ) : (
                                      selectedTests.map(
                                        ({ testName, ...val }, index) => (
                                          <React.Fragment key={val.id}>
                                            <ListItem
                                              sx={{
                                                px: 2,
                                                py: 0,
                                                "&:hover": {
                                                  background: `${theme.colors.alpha.black[10]}`,
                                                },
                                              }}
                                              onClick={() => {
                                                handleRemoveSelectTest(val.id);
                                              }}
                                            >
                                              <Tooltip
                                                title={t(`Remove ${testName}`)}
                                                arrow
                                                placement="right"
                                                sx={{
                                                  textTransform: "uppercase",
                                                }}
                                              >
                                                <IconButtonWrapper color="primary">
                                                  <ArrowBack fontSize="small" />
                                                </IconButtonWrapper>
                                              </Tooltip>
                                              <ListItemText
                                                primary={
                                                  <Typography
                                                    gutterBottom
                                                    variant="h4"
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      textTransform:
                                                        "uppercase",
                                                    }}
                                                  >
                                                    {t(testName)}
                                                  </Typography>
                                                }
                                              />
                                            </ListItem>
                                            {index !==
                                              selectedTests.length - 1 && (
                                              <Divider />
                                            )}
                                          </React.Fragment>
                                        )
                                      )
                                    )}
                                  </List>
                                </Scrollbar>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={
                              isSubmitting ? (
                                <CircularProgress size="1rem" />
                              ) : null
                            }
                            disabled={isSubmitting}
                          >
                            {t("Save Patient Details and Next")}
                          </Button>
                        </Grid>
                      </Grid>
                    </FilterOptions>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>

      <Footer />
    </>
  );
}

export default DashboardReports;
