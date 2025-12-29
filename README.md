|                      |                |                                                                                                |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| :placard:            | **Summary**    | A plugin for selectively merging data between performers in Stash.                             |
| :link:               | **Repository** | https://github.com/Valkyr-JS/stash-mergers                                                      |
| :information_source: | **Source URL** | https://valkyr-js.github.io/stash-plugins/index.yml                                            |
| :open_book:          | **Install**    | [How to install plugins via package manager](https://docs.stashapp.cc/plugins/#adding-sources) |

## Features

- Merge duplicate performers whilst selecting which data you want to keep from each.
- Merge lists of aliases, URLs, custom fields and tags with a single click.
- A familiar UI based on the Stash scraper dialog box.
- Localization support where possible\*
- _Planned_ - support for merging studios

\* Stash Mergers references the localization file for the user's selected language in Stash. In some places, e.g. some warning messages, localization options aren't available so they are hardcoded in English.

### Known Issues

- 17/12/2024 - Stash instances that are locked behind a username and password will run into issues with broken performer images when running a merge in either direction. This is an issue with Stash rather than the plugin, and [has been raised on the GitHub issues page there](https://github.com/stashapp/stash/issues/5538). I've looked at various workarounds, but the only thing that will work for now is turning off credentials in Stash whilst running a merge. I'm keeping an eye on the issue and will update this plugin if needed as soon as a fix is available.

## Installation

1. In Stash go to Settings > Plugins.
2. Under _Available Plugins_ click the Add Source button.
3. Fill out the fields in the popup form. The Name and Local Path fields can be whatever you like, but the Source URL needs to match the URL below. I recommend the following;
      - Name: Valkyr-JS
      - Source URL: https://valkyr-js.github.io/stash-plugins/index.yml
      - Local Path: Valkyr-JS
4. Click confirm and you should see a new line under _Available Plugins_ called "Valkyr-JS" (or whatever you entered for Name in the popup). Click this and you'll see my available plugins.
5. Check the _Stash Mergers_ checkbox and click Install to the top right of _Avaialable Plugins_.
6. Go to a performer's profile page to find the Merge button next to the red Delete button. You may need to refresh the page to see the changes.

## How to use

**FIRST BACKUP YOUR DATABASE!**

Always back up your database before starting a merge. I have tested this plugin thoroughly on my own setup and fixed the bugs I have found, but as everyone's setup is a little different there may be problems I haven't discovered yet. Please run a backup before starting, and [report any issues on the repository](https://github.com/Valkyr-JS/stash-mergers/issues). I take no responsibility for any loss of data. You have been warned.

---

To get started, go to the profile page of a performer you want to merge with another. In this example, I have my main Abella Danger profile on the left scraped from StashDB and a second profile created using a different scraper. It doesn't matter which profile I click on, but in this example, I'm going to click on my main profile.

![step-01-duplicate-profiles](https://github.com/user-attachments/assets/6af9cacd-72e9-434e-ba15-d40a0a039642)

On the profile page, I can click the "Merge..." button. This opens a dropdown where I can select whether to merge from another profile or merge into another profile. As I want to keep this main profile as the original source, I click "Merge from...". If in the previous step, I had clicked the second profile, I would choose "Merge into..." instead.

![step-02-initial-profile](https://github.com/user-attachments/assets/8b5e8914-04ce-4003-a6b3-d7c0b0919bf7)

Whichever you choose, a modal will now appear which will let you select the other profile. Type in the box to filter the results, then click Confirm.

![step-03-select-performer](https://github.com/user-attachments/assets/3f49fa6e-5b67-48b2-8f7c-e25186cc81f8)

The final modal will show you two profiles side-by-side. Note that whichever direction you choose to merge, here the destination performer (i.e. the one you will keep) is always on the left, and the source performer (i.e. the one that will be removed) is always on the right.

The forms here work much like the Stash scraper dialog boxes; the source data can be modified (except for the performer's name and image), and only new or different data is displayed. For example, the fields for disambiguation and height are shown as they are new and different respectively. However, the birthdate is not displayed because the data matches in both profiles.

Select the fields you want to use by clicking the white cross button next to each field to turn it into a green tick. The source fields are checked by default.

![step-04-merge-modal](https://github.com/user-attachments/assets/9ef5e8c6-15f4-4f3a-8948-e8078c268e38)

Note that for list fields, such as aliases, URLs, and tags, you can click the "Merge" button below the field label to merge both lists together into the source field. This filters out duplicate entries.

![step-05-list-merge](https://github.com/user-attachments/assets/096f93f9-c590-4bf8-93cb-54a9e19b3b7b)

If at any point I want to reset to the beginning, I can click the Refresh button at the bottom of the modal.

Once I'm happy with my selection, I can click the Confirm button to execute the merge. **There is no undoing the merge once the Confirm button is clicked**. Once again, make sure you have backed up your database before executing a merge!

When the merge has been completed, the page will be refreshed and, if needed, you will be redirected to the destination performer's profile page. As you can see from the below image, my Abella Danger profile now has the additional alias I merged from the second profile, and has been tagged in the scenes and galleries that previously featured the second profile.

![step-06-complete](https://github.com/user-attachments/assets/3b878f65-aed0-4ad5-9886-76f24c2628b0)
