import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthActivitySummary,
} from 'react-native-health'
// import App from '../App'

/* Permission options */
const permissions = {
  permissions: {
    // read: [AppleHealthKit.Constants.Permissions.HeartRate],
    // write: [AppleHealthKit.Constants.Permissions.Steps],
    read: [AppleHealthKit.Constants.Permissions.ActivitySummary, AppleHealthKit.Constants.Permissions.SleepAnalysis]
  },
} as HealthKitPermissions

AppleHealthKit.initHealthKit(permissions, (error: string) => {
  /* Called after we receive a response from the system */

  if (error) {
    console.log('[ERROR] Cannot grant permissions!')
  }

  /* Can now read or write to HealthKit */

  // const options = {
  //   startDate: new Date(2020, 1, 1).toISOString(),
  // }

  // AppleHealthKit.getHeartRateSamples(
  //   options,
  //   (callbackError: string, results: HealthValue[]) => {
  //     /* Samples are now collected from HealthKit */
  //   },
  // )

  let options = {
    startDate: new Date(2021, 0, 0).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
  }

  AppleHealthKit.getActivitySummary(
    options,
    (err: string, results: HealthActivitySummary[]) => {
      //     /* Samples are now collected from HealthKit */
    },
  )

  AppleHealthKit.getSleepSamples(
    options, 
    (err: Object, results: Array<HealthValue>) => {

    }
  );
})