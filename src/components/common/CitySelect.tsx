'use client'

import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { cities, citiesByCountry } from '@/lib/utils/cities'

interface CitySelectProps {
  value: string
  onChange: (cityName: string) => void
  label?: string
  required?: boolean
  error?: string
}

export default function CitySelect({
  value,
  onChange,
  label = 'City',
  required = false,
  error
}: CitySelectProps) {
  const [query, setQuery] = useState('')

  const filteredCities = query === ''
    ? cities
    : cities.filter((city) =>
        city.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  return (
    <div className="w-full">
      <Combobox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <div className="relative w-full">
            {label && (
              <Combobox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
              </Combobox.Label>
            )}
            <Combobox.Input
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(cityName: string) => cityName}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 sm:text-sm">
              {Object.entries(citiesByCountry).map(([country, cityNames]) => (
                <div key={country}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {country}
                  </div>
                  {cityNames
                    .filter(cityName =>
                      cityName
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .includes(query.toLowerCase().replace(/\s+/g, ''))
                    )
                    .map((cityName) => (
                      <Combobox.Option
                        key={cityName}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900 dark:text-white'
                          }`
                        }
                        value={cityName}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {cityName}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-indigo-600'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                </div>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
} 