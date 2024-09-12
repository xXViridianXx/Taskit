import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
    HealthInputOptions,
    HealthActivitySummary,
} from 'react-native-health'

function convertMilliseconds(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}:${minutes}`;
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

let activityData = []
let sleepData = []

const HealthKit = () => {

    /* Permission options */
    const permissions = {
        permissions: {
            read: [AppleHealthKit.Constants.Permissions.ActivitySummary, AppleHealthKit.Constants.Permissions.SleepAnalysis]

        },
    } as HealthKitPermissions

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
        /* Called after we receive a response from the system */

        if (error) {
            console.log('[ERROR] Cannot grant permissions!')
        }


        let options = {
            startDate: new Date(0, 0, 0).toISOString(), // required
            endDate: new Date().toISOString(), // optional; default now
            limit: 7, // optional; default no limit
            ascending: true, // optional; default false
        }

        AppleHealthKit.getSleepSamples(
            options, (err: Object, results: HealthValue[]) => {
                if (err) {
                    return;
                }

                sleepData = results.map((key, id) => {
                    const startDate = Date.parse(key.startDate)
                    const endDate = Date.parse(key.endDate)
                    const diff = endDate - startDate
                    return {
                        "id": id + 1,
                        "date": startDate,
                        "sleepDuration": convertMilliseconds(diff),
                        "activityDuration": 0
                    }
                })

            },
        )

        activityData = []

        sleepData.forEach((item, id) => {
            let options = {
                startDate: new Date(item.date).toISOString(), // required
                endDate: new Date(item.date).toISOString(), // optional; default now
                limit: 1, // optional; default no limit
                ascending: true, // optional; default false
            }

            AppleHealthKit.getActivitySummary(
                options,
                (err: Object, results: HealthActivitySummary[]) => {
                    if (err) {
                        return
                    }

                    // sleepData[id].activityDuration = results[0] ? results[0].appleExerciseTime : 30
                    sleepData[id].activityDuration = results[0] ? results[0].appleExerciseTime : randomIntFromInterval(0, 60)
                },
            )

        })

    })
    return { sleepData }
}


export default HealthKit