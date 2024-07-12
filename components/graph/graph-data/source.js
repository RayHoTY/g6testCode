export const data = 
{
      "nodes": [
            {
                  "id": "1",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "STELLA\\client5",
                  "display": {
                        "labels": [
                              "User"
                        ],
                        "tag": ""
                  },
                  "properties": [
                        {
                              "Account_Domain": "STELLA",
                              "Account_Name": "client5",
                              "User": "STELLA\\client5",
                              "Title": "STELLA\\client5",
                              "tag": ""
                        }
                  ]
            },
            {
                  "id": "2",
                  "inRange": true,
                  "visible": true,
                  "type": "node",
                  "label": "QDS7.stella.local",
                  "display": {
                        "labels": [
                              "Computer"
                        ],
                        "tag": ""
                  },
                  "properties": [
                        {
                              "ComputerName": "QDS7.stella.local",
                              "IP Address": "10.0.5.87",
                              "Title": "QDS7.stella.local",
                              "tag": ""
                        }
                  ]
            }
      ],
      "edges": [
            {
                  "type": "timeBarInfo",
                  "dateFreq": {
                        "1667577645": 2,
                        "1667577813": 2
                  },
                  "firstDate": 1667577645,
                  "lastDate": 1667577813
            },
            {
                  "id": "1-2-Login (CachedInteractive)",
                  "type": "edge",
                  "source": "1",
                  "target": "2",
                  "date": [
                        1667577645,
                        1667577813
                  ],
                  "event": "Login (CachedInteractive)",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 2,
                  "merged_edges": {
                        "ids": [
                              "9",
                              "3"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "ActiveDirectoryModelBase",
                                    "Event4624Model"
                              ],
                              "agentDevice": "WindowsLog",
                              "agentLogFile": "Security",
                              "pluginVersion": "7.2.9.105",
                              "source": "Microsoft-Windows-Security-Auditing",
                              "computerName": "QDS7.stella.local",
                              "originatingComputer": "10.0.5.87",
                              "eventID": 4624,
                              "eventCategory": 12544,
                              "recordNumber": 3473814,
                              "level": "Log Always",
                              "task": "SE_ADT_LOGON_LOGON",
                              "opCode": "Info",
                              "message": "An account was successfully logged on.",
                              "sourceip": "127.0.0.1",
                              "time": "11-04-2022 16:00:45",
                              "epochTime": 1667577645000,
                              "keyWords": "Audit Success",
                              "newLogonID": "0xE0CD4F",
                              "logsourceTime": 1636099287,
                              "subjectLogonID": "0x3E7",
                              "subjectLogonType": "11",
                              "subjectSecurityID": "NT AUTHORITY\\SYSTEM",
                              "subjectAccountName": "QDS7$",
                              "subjectAccountDomain": "STELLA",
                              "newLogonSecurityID": "STELLA\\client5",
                              "newLogonAccountName": "client5",
                              "newLogonAccountDomain": "STELLA",
                              "linkedLogonID": "0x0",
                              "logonGUID": "{00000000-0000-0000-0000-000000000000}",
                              "processID": "0x398",
                              "workstationName": "QDS7",
                              "sourceNetworkAddress": "127.0.0.1",
                              "logonProcess": "User32",
                              "authenticationPackage": "Negotiate",
                              "Title": "Login (CachedInteractive)",
                              "tag": ""
                        },
                        {
                              "_t": [
                                    "ActiveDirectoryModelBase",
                                    "Event4624Model"
                              ],
                              "agentDevice": "WindowsLog",
                              "agentLogFile": "Security",
                              "pluginVersion": "7.2.9.105",
                              "source": "Microsoft-Windows-Security-Auditing",
                              "computerName": "QDS7.stella.local",
                              "originatingComputer": "10.0.5.87",
                              "eventID": 4624,
                              "eventCategory": 12544,
                              "recordNumber": 3474150,
                              "level": "Log Always",
                              "task": "SE_ADT_LOGON_LOGON",
                              "opCode": "Info",
                              "message": "An account was successfully logged on.",
                              "sourceip": "127.0.0.1",
                              "time": "11-04-2022 16:03:33",
                              "epochTime": 1667577813000,
                              "keyWords": "Audit Success",
                              "newLogonID": "0xE308F8",
                              "logsourceTime": 1636099452,
                              "subjectLogonID": "0x3E7",
                              "subjectLogonType": "11",
                              "subjectSecurityID": "NT AUTHORITY\\SYSTEM",
                              "subjectAccountName": "QDS7$",
                              "subjectAccountDomain": "STELLA",
                              "newLogonSecurityID": "STELLA\\client5",
                              "newLogonAccountName": "client5",
                              "newLogonAccountDomain": "STELLA",
                              "linkedLogonID": "0x0",
                              "logonGUID": "{00000000-0000-0000-0000-000000000000}",
                              "processID": "0x398",
                              "workstationName": "QDS7",
                              "sourceNetworkAddress": "127.0.0.1",
                              "logonProcess": "User32",
                              "authenticationPackage": "Negotiate",
                              "Title": "Login (CachedInteractive)",
                              "tag": ""
                        }
                  ]
            },
            {
                  "id": "1-2-Login (Unlock)",
                  "type": "edge",
                  "source": "1",
                  "target": "2",
                  "date": [
                        1667577645,
                        1667577812,
                        1667577850,
                        1667577890
                  ],
                  "event": "Login (Unlock)",
                  "g": null,
                  "ttp": false,
                  "inRange": true,
                  "visible": true,
                  "frequency": 4,
                  "merged_edges": {
                        "ids": [
                              "12",
                              "6"
                        ],
                        "score_ttp": [
                              "0"
                        ]
                  },
                  "properties": [
                        {
                              "_t": [
                                    "ActiveDirectoryModelBase",
                                    "Event4624Model"
                              ],
                              "agentDevice": "WindowsLog",
                              "agentLogFile": "Security",
                              "pluginVersion": "7.2.9.105",
                              "source": "Microsoft-Windows-Security-Auditing",
                              "computerName": "QDS7.stella.local",
                              "originatingComputer": "10.0.5.87",
                              "eventID": 4624,
                              "eventCategory": 12544,
                              "recordNumber": 3473820,
                              "level": "Log Always",
                              "task": "SE_ADT_LOGON_LOGON",
                              "opCode": "Info",
                              "message": "An account was successfully logged on.",
                              "sourceip": "10.0.5.87",
                              "time": "11-04-2022 16:00:45",
                              "epochTime": 1667577645000,
                              "keyWords": "Audit Success",
                              "newLogonID": "0xE0CDF9",
                              "logsourceTime": 1636099287,
                              "subjectLogonID": "0x3E7",
                              "subjectLogonType": "7",
                              "subjectSecurityID": "NT AUTHORITY\\SYSTEM",
                              "subjectAccountName": "QDS7$",
                              "subjectAccountDomain": "STELLA",
                              "newLogonSecurityID": "STELLA\\client5",
                              "newLogonAccountName": "client5",
                              "newLogonAccountDomain": "STELLA",
                              "linkedLogonID": "0x0",
                              "logonGUID": "{169FFF4B-513C-290D-08A5-57D50B8A0D4E}",
                              "processID": "0x230",
                              "workstationName": "QDS7",
                              "logonProcess": "Negotiat",
                              "authenticationPackage": "Negotiate",
                              "Title": "Login (Unlock)",
                              "tag": ""
                        },
                        {
                              "_t": [
                                    "ActiveDirectoryModelBase",
                                    "Event4624Model"
                              ],
                              "agentDevice": "WindowsLog",
                              "agentLogFile": "Security",
                              "pluginVersion": "7.2.9.105",
                              "source": "Microsoft-Windows-Security-Auditing",
                              "computerName": "QDS7.stella.local",
                              "originatingComputer": "10.0.5.87",
                              "eventID": 4624,
                              "eventCategory": 12544,
                              "recordNumber": 3474156,
                              "level": "Log Always",
                              "task": "SE_ADT_LOGON_LOGON",
                              "opCode": "Info",
                              "message": "An account was successfully logged on.",
                              "sourceip": "10.0.5.87",
                              "time": "11-04-2022 16:03:33",
                              "epochTime": 1667577813000,
                              "keyWords": "Audit Success",
                              "newLogonID": "0xE30935",
                              "logsourceTime": 1636099452,
                              "subjectLogonID": "0x3E7",
                              "subjectLogonType": "7",
                              "subjectSecurityID": "NT AUTHORITY\\SYSTEM",
                              "subjectAccountName": "QDS7$",
                              "subjectAccountDomain": "STELLA",
                              "newLogonSecurityID": "STELLA\\client5",
                              "newLogonAccountName": "client5",
                              "newLogonAccountDomain": "STELLA",
                              "linkedLogonID": "0x0",
                              "logonGUID": "{C1F8509A-D210-01EA-4E55-A1ED6F71D8BF}",
                              "processID": "0x230",
                              "workstationName": "QDS7",
                              "logonProcess": "Negotiat",
                              "authenticationPackage": "Negotiate",
                              "Title": "Login (Unlock)",
                              "tag": ""
                        }
                  ]
            }
      ]
}