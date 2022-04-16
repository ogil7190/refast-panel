import React from 'react'
import PropTypes from 'prop-types'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = ({ matrices }) => {
  return matrices ? (
    <CRow>
      {matrices.map((matrix, index) => {
        return (
          <CCol sm={6} lg={3} key={`matrix-${index}`}>
            <CWidgetStatsA
              className="mb-4"
              color={matrix.color}
              value={<>{matrix.today} </>}
              title={matrix.title}
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: matrix.chartLabels,
                    datasets: [
                      {
                        label: matrix.title,
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle(`--cui-${matrix.color}`),
                        data: matrix.chartData,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
        )
      })}
    </CRow>
  ) : null
}

WidgetsDropdown.propTypes = {
  matrices: PropTypes.array,
}

export default WidgetsDropdown
