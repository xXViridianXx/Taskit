import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
    HealthInputOptions,
    HealthActivitySummary,
} from 'react-native-health'

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}



const getCurActivityDur = () => {
    
    let activityDur = 0
    
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
            startDate: new Date().toISOString(), // required
            endDate: new Date().toISOString(), // optional; default now
            limit: 1, // optional; default no limit
            ascending: true, // optional; default false
        }

        AppleHealthKit.getActivitySummary(
            options,
            (err: Object, results: HealthActivitySummary[]) => {
                if (err) {
                    return
                }

                activityDur = results[0] ? results[0].appleExerciseTime : randomIntFromInterval(0, 60)
            },
        )

    })

    return {activityDur}
}

export default getCurActivityDur