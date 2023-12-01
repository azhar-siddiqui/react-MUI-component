/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFormik } from "formik";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { Button, Grid } from "@mui/material";
import dayjs from "dayjs";

function App() {
  const formik = useFormik({
    initialValues: {
      drReference: "",
    },
    onSubmit: (values: any) => {
      console.log(values);
    },
  });

  const handleDrReferenceChange = (e: any, value: any) => {
    formik.setFieldValue("drReference", value?.name || "");
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={4}
      mt={2}
    >
      <Grid item xs={12}>
        <form onSubmit={formik.handleSubmit}>
          <Grid
            sx={{ px: 4 }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <Grid container direction="row" alignItems="stretch" spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    id="disable-clearable"
                    disableClearable
                    fullWidth
                    limitTags={1}
                    getOptionLabel={(option) => option.name}
                    options={assignees}
                    onChange={handleDrReferenceChange}
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
                        label="Dr. Reference"
                        placeholder="Select Doctor"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Date"
                    defaultValue={dayjs(new Date())}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Click
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default App;

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
