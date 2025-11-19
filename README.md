# goodbye

This is an experiment. Use at your own risk.

I know you should never be doing anything personal on your work laptop but sometimes that can't be avoided. Then one day you are terminated and immediately shut out of your machine and you had no time to clean up and delete all of your personal items. What this project attempts to do is setup a background process, similar to a cron job, that checks a public gist for a specific keyword. You then run a shell script if the word it finds matches

## Requirements

This is only for MacOS at the moment.

[Install Deno](https://docs.deno.com/runtime/getting_started/installation/)

You'll need a Github account, because you'll be creating a public [gist](https://gist.github.com/)

## Setup

### Gist

Make a public [gist](https://gist.github.com/) with just one file in it. In that file put any 1 single word in it. See mine as an example: <https://gist.github.com/FranciscoG/1377cabdd4b38ce3525c62300515d681>

### .env

Make a copy of the `.env.example`
```sh
cp .env.example .env
```

Then fill out the env vars using the info from your new gist:

```ini
BYE_GITHUB_USERNAME=

# the UUID at the end of your URL of your new gist
BYE_GIST_ID=

# In my example I called it "answer.txt"
# It can be anything you want with any extension you want. 
# It will be read as plain text
BYE_GIST_FILE=

# This is the keyword it's trying to match.
BYE_KEYWORD=anything
```

### Create the executable

Run this deno command and it will create a local standalone executable called `check` in the same folder:

```sh
deno task compile
```

### Update the plist

#### ProgramArguments

This is the only **required** one you should definitely change. Update the path to where you placed the executable and your shell script that handles deleting things.

```xml
<key>ProgramArguments</key>
<array>
	<string>/bin/bash</string>
	<string>-lc</string>
	<string>~/path/to/check && ~/path/to/bye.sh</string>
</array>
```

#### The Interval

Update the `StartCalendarInterval` to your desired interval. It's similar to a cron job.

Right now it's setup to run every hour at minute 0. 

```xml
<key>StartCalendarInterval</key>
<dict>
	<key>Minute</key>
	<integer>0</integer>
</dict>
```

The keys available are keys `Minute`, `Hour`, `Day`, `Weekday`, `Month`

Google `StartCalendarInterval` for more examples. Here's one blog post I found that seems helpful: <https://alvinalexander.com/mac-os-x/launchd-plist-examples-startinterval-startcalendarinterval/>

#### Logs

I set the logs to write to `/var/log/goodbye`, change that if you want. If you do, update [load.sh](./load.sh) because it uses `mkdir -p` to create the log folder in there.

```xml
<key>StandardErrorPath</key>
<string>/var/log/goodbye/stderr.log</string>

<key>StandardOutPath</key>
<string>/var/log/goodbye/stdout.log</string>
```

#### Path

Check the path to make sure it includes any paths you need.

```xml
<key>EnvironmentVariables</key>
<dict>
	<key>PATH</key>
	<string><![CDATA[/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin]]></string>
</dict>
```

### Load the plist

```sh
./load.sh
```

## Why not a cron job?

While `crontab` is supported on MacOS, the preferred way of running timed processes is launch agents. The main reason is how your computer going to sleep affects it:

From Apple's [documentation](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/ScheduledJobs.html#//apple_ref/doc/uid/10000172i-CH1-SW2):

> if the system is turned off or asleep, cron jobs do not execute; they will not run until the next designated time occurs.

> If you schedule a launchd job by setting the `StartCalendarInterval` key and the computer is asleep when the job should have run, your job will run when the computer wakes up. However, if the machine is off when the job should have run, the job does not execute until the next designated time occurs.

## Resources

<https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html>

<https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/ScheduledJobs.html#//apple_ref/doc/uid/10000172i-CH1-SW2>