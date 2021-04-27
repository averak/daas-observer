# DaaS Observer

![test](https://github.com/averak/daas-observer/workflows/test/badge.svg)
![code check](https://github.com/averak/daas-observer/workflows/code%20check/badge.svg)
![deploy](https://github.com/averak/daas-observer/workflows/deploy/badge.svg)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Twitter](https://img.shields.io/badge/Twitter-%40rits_dajare-blue?style=flat-square&logo=twitter)](https://twitter.com/rits_dajare)

This app is intermediate server of the dajare judgement service.

It runs on Google spreadsheets and is responsible for storing data and posting to Twitter.

## Develop

### Requirements

- Google Apps Script
- yarn

### Installing

Clone this repository.

Then, install dependencies with yarn.

```sh
$ yarn
```

### Commands

See `scripts` section of [package.json](./package.json)

- `yarn run publish` - build and deploy
- `yarn run test` - run test
- `yarn run check` - code check

## References

- [立命館ダジャレサークル](https://rits-dajare.github.io/)
- [DaaS(Dajare as a Service)](https://github.com/rits-dajare/DaaS)
- [ダジャレ管理シート](https://docs.google.com/spreadsheets/d/16QeSzLD790hsDSm-lQaNBxa7f2_-BmFi8SLawqkRO2o/edit#gid=0)
