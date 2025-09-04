import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getStats } from "../service/application"

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    rejected: 0,
    interviewed: 0,
    offered: 0,
    applied: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await getStats()
        console.log("API Response:", response) // 调试用

        if (response && response.data) {
          setStats(response.data)
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
    </div>
  )
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <p className="text-red-500 dark:text-red-400 text-lg mb-2">Error loading dashboard</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
    </div>
  )

  // 计算转化率
  const conversionRate =
    stats.applied > 0 ? ((stats.offered / stats.applied) * 100).toFixed(1) : 0
  
  // 计算漏斗数据
  const funnelData = [
    { 
      label: "Applied", 
      value: stats.applied, 
      percentage: 100,
      color: "bg-blue-500",
      icon: "📝"
    },
    { 
      label: "Interviewed", 
      value: stats.interviewed, 
      percentage: stats.applied > 0 ? (stats.interviewed / stats.applied * 100) : 0,
      color: "bg-yellow-500",
      icon: "💬"
    },
    { 
      label: "Offered", 
      value: stats.offered, 
      percentage: stats.applied > 0 ? (stats.offered / stats.applied * 100) : 0,
      color: "bg-green-500",
      icon: "🎉"
    }
  ]

  return (
    <div className="w-full space-y-8">
      {/* 数据概览 - 一行显示 */}
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
          <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-3 text-center"
        >
          <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">Applied</p>
          <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">{stats.applied}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-800 p-3 text-center"
        >
          <p className="text-xs text-yellow-600 dark:text-yellow-300 mb-1">Interviewed</p>
          <p className="text-lg md:text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.interviewed}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-3 text-center"
        >
          <p className="text-xs text-green-600 dark:text-green-300 mb-1">Offered</p>
          <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">{stats.offered}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-3 text-center"
        >
          <p className="text-xs text-red-600 dark:text-red-300 mb-1">Rejected</p>
          <p className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </motion.div>
      </div>

      {/* 转化漏斗 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Application Conversion Funnel
        </h2>
        
        <div className="space-y-6">
          {funnelData.map((stage, index) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
              className="relative"
            >
              {/* 漏斗条 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-24">
                  <span className="text-lg">{stage.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.label}
                  </span>
                </div>
                
                <div className="flex-1 relative">
                  {/* 背景条 */}
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* 进度条 */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ duration: 1, delay: 1 + index * 0.2, ease: "easeOut" }}
                      className={`h-full ${stage.color} relative overflow-hidden`}
                    >
                      {/* 动画光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                  
                  {/* 数值显示 */}
                  <div className="absolute right-0 top-0 h-8 flex items-center pr-3">
                    <span className="text-sm font-bold text-white mix-blend-difference">
                      {stage.value} ({stage.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 连接线 */}
              {index < funnelData.length - 1 && (
                <div className="flex justify-center mt-2 mb-2">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.2 }}
                    className="w-0.5 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* 总体转化率 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Overall Conversion Rate</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {conversionRate}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            (offered ÷ applied × 100)
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard
