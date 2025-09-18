export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Tailwind CSS Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Styling Test</h2>
          <p className="text-gray-600 mb-4">
            If you can see this text with proper styling, Tailwind CSS is working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-500 text-white p-4 rounded-lg">Red Box</div>
            <div className="bg-green-500 text-white p-4 rounded-lg">Green Box</div>
            <div className="bg-blue-500 text-white p-4 rounded-lg">Blue Box</div>
          </div>
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Test Button
          </button>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            This is a notification box with custom colors and borders.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1 bg-purple-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium text-purple-800">Flex Item 1</h3>
          </div>
          <div className="flex-1 bg-pink-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium text-pink-800">Flex Item 2</h3>
          </div>
        </div>
      </div>
    </div>
  );
}